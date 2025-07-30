import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ error: 'Token, email, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    });

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      });
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json({ error: 'Reset token has already been used' }, { status: 400 });
    }

    // Verify email matches
    if (resetToken.user.email !== email) {
      return NextResponse.json({ error: 'Invalid reset token for this email' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.user.id },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while resetting your password.' 
    }, { status: 500 });
  }
} 