import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists and is not already verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, emailVerified: true }
    });

    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a verification link has been sent.' 
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        error: 'Email is already verified' 
      }, { status: 400 });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Delete any existing unused verification tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: {
        userId: user.id,
        used: false
      }
    });

    // Create new verification token
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Create verification link
    const verificationLink = `${req.nextUrl.origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationLink, user.firstName);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json({ 
        error: 'Failed to send verification email. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully.'
    });

  } catch (error) {
    console.error('Email verification request error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request.' 
    }, { status: 500 });
  }
} 