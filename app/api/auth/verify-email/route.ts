import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token and email are required' }, { status: 400 });
    }

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true, emailVerified: true }
        }
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      });
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // Check if token has been used
    if (verificationToken.used) {
      return NextResponse.json({ error: 'Verification token has already been used' }, { status: 400 });
    }

    // Verify email matches
    if (verificationToken.user.email !== email) {
      return NextResponse.json({ error: 'Invalid verification token for this email' }, { status: 400 });
    }

    // Check if user is already verified
    if (verificationToken.user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Mark email as verified and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.user.id },
        data: { emailVerified: true }
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while verifying your email.' 
    }, { status: 500 });
  }
} 