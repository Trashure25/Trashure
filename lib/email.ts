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
      config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
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
          <h1>Welcome to Trashure!</h1>
          <p>Hi ${firstName}!</p>
          <p>Thank you for creating your Trashure account! To start trading your treasures, please verify your email address by clicking the link below:</p>
          <p><a href="${verificationLink}">Verify Email Address</a></p>
          <p>If the link doesn't work, copy and paste this into your browser:</p>
          <p>${verificationLink}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>Best regards,<br>The Trashure Team</p>
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
      config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
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
          <h1>Password Reset</h1>
          <p>Hi ${firstName}!</p>
          <p>We received a request to reset your Trashure account password. Click the link below to create a new password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>If the link doesn't work, copy and paste this into your browser:</p>
          <p>${resetLink}</p>
          <p>This reset link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The Trashure Team</p>
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