import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for verification tokens
    const verificationTokens = await prisma.emailVerificationToken.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        used: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      user,
      verificationTokens,
      debug: {
        emailVerified: user.emailVerified,
        tokenCount: verificationTokens.length,
        usedTokens: verificationTokens.filter(t => t.used).length,
        unusedTokens: verificationTokens.filter(t => !t.used).length,
        expiredTokens: verificationTokens.filter(t => t.expiresAt < new Date()).length,
      }
    });

  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while debugging user.' 
    }, { status: 500 });
  }
} 