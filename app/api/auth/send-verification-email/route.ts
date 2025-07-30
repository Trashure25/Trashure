import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

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

    // In a real implementation, you would send an email here
    // For now, we'll return the token in the response for demo purposes
    const verificationLink = `${req.nextUrl.origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    console.log('Email verification link for demo:', verificationLink);

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully.',
      demoLink: verificationLink // Remove this in production
    });

  } catch (error) {
    console.error('Email verification request error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request.' 
    }, { status: 500 });
  }
} 