import nodemailer from 'nodemailer';

// Create a test account for development (you can replace this with real SMTP credentials)
const createTestAccount = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      return {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      };
    } catch (error) {
      console.error('Failed to create test account:', error);
      // Fallback to console logging
      return null;
    }
  }
  return null;
};

// For production, you would use real SMTP credentials
const getProductionConfig = () => {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

export const sendVerificationEmail = async (email: string, verificationLink: string, firstName: string) => {
  try {
    // Get email configuration
    let config;
    
    // Priority 1: Use production SMTP if credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      config = getProductionConfig();
      console.log('Using production SMTP configuration');
    }
    // Priority 2: Use Gmail SMTP with app password
    else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      };
      console.log('Using Gmail SMTP configuration');
    }
    // Priority 3: Try to create test account for development (only if no other config)
    else if (process.env.NODE_ENV === 'development') {
      config = await createTestAccount();
      console.log('Using development test account');
    }

    if (!config) {
      // Final fallback: just log the email for development
      console.log('=== EMAIL VERIFICATION (Development Mode) ===');
      console.log('To:', email);
      console.log('Subject: Verify your Trashure account');
      console.log('Verification Link:', verificationLink);
      console.log('============================================');
      return { success: true, messageId: 'dev-mode' };
    }

    // Create transporter
    const transporter = nodemailer.createTransport(config);

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@trashure.com', // Use simple email address
      to: email,
      subject: 'Verify your Trashure account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Trashure!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your sustainable fashion marketplace</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for creating your Trashure account! To start trading your treasures, 
              please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; color: #495057;">
              <a href="${verificationLink}" style="color: #667eea;">${verificationLink}</a>
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              This verification link will expire in 24 hours. If you didn't create a Trashure account, 
              you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Trashure. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Welcome to Trashure!

Hi ${firstName},

Thank you for creating your Trashure account! To start trading your treasures, please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 24 hours. If you didn't create a Trashure account, you can safely ignore this email.

Best regards,
The Trashure Team
      `,
    };

    // Send email
    console.log('Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    // If using Ethereal (development), log the preview URL
    if (process.env.NODE_ENV === 'development' && info.messageId) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Failed to send verification email:', error);
    
    // Log specific error details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check for common SMTP errors
      if (error.message.includes('Invalid login')) {
        console.error('SMTP Authentication failed - check your username and password');
      } else if (error.message.includes('Connection timeout')) {
        console.error('SMTP Connection timeout - check your host and port');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('SMTP Host not found - check your SMTP_HOST');
      }
    }
    
    // Fallback: log the email for debugging
    console.log('=== EMAIL VERIFICATION (Fallback Mode) ===');
    console.log('To:', email);
    console.log('Subject: Verify your Trashure account');
    console.log('Verification Link:', verificationLink);
    console.log('============================================');
    
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string, firstName: string) => {
  try {
    // Get email configuration
    let config;
    
    // Priority 1: Use production SMTP if credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      config = getProductionConfig();
      console.log('Using production SMTP configuration for password reset');
    }
    // Priority 2: Use Gmail SMTP with app password
    else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      };
      console.log('Using Gmail SMTP configuration for password reset');
    }
    // Priority 3: Try to create test account for development (only if no other config)
    else if (process.env.NODE_ENV === 'development') {
      config = await createTestAccount();
      console.log('Using development test account for password reset');
    }

    if (!config) {
      // Final fallback: just log the email for development
      console.log('=== PASSWORD RESET (Development Mode) ===');
      console.log('To:', email);
      console.log('Subject: Reset your Trashure password');
      console.log('Reset Link:', resetLink);
      console.log('==========================================');
      return { success: true, messageId: 'dev-mode' };
    }

    // Create transporter
    const transporter = nodemailer.createTransport(config);

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@trashure.com', // Use simple email address
      to: email,
      subject: 'Reset your Trashure password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Trashure Account Security</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your Trashure account password. 
              Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; color: #495057;">
              <a href="${resetLink}" style="color: #667eea;">${resetLink}</a>
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              This reset link will expire in 24 hours. If you didn't request a password reset, 
              you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Trashure. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Password Reset Request

Hi ${firstName},

We received a request to reset your Trashure account password. Click the link below to create a new password:

${resetLink}

This reset link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.

Best regards,
The Trashure Team
      `,
    };

    // Send email
    console.log('Attempting to send password reset email to:', email);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent successfully:', info.messageId);
    
    // If using Ethereal (development), log the preview URL
    if (process.env.NODE_ENV === 'development' && info.messageId) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    
    // Log specific error details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check for common SMTP errors
      if (error.message.includes('Invalid login')) {
        console.error('SMTP Authentication failed - check your username and password');
      } else if (error.message.includes('Connection timeout')) {
        console.error('SMTP Connection timeout - check your host and port');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('SMTP Host not found - check your SMTP_HOST');
      }
    }
    
    // Fallback: log the email for debugging
    console.log('=== PASSWORD RESET (Fallback Mode) ===');
    console.log('To:', email);
    console.log('Subject: Reset your Trashure password');
    console.log('Reset Link:', resetLink);
    console.log('==========================================');
    
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}; 