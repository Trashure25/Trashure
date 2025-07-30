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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false
      }
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // In a real implementation, you would send an email here
    // For now, we'll return the token in the response for demo purposes
    const resetLink = `${req.nextUrl.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    console.log('Password reset link for demo:', resetLink);

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset link sent successfully.',
      demoLink: resetLink // Remove this in production
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request.' 
    }, { status: 500 });
  }
} 