import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trashure_jwt')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Validate JWT token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!payload || !payload.userId) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(payload.userId)) {
      return NextResponse.json({ message: 'Invalid user ID in token' }, { status: 401 });
    }

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Fetch user with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          trustScore: true,
          role: true,
          isBanned: true,
          banReason: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && (
      error.message.includes('Can\'t reach database server') ||
      error.message.includes('Connection terminated') ||
      error.message.includes('Connection timeout') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    );
    
    if (isConnectionError) {
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
} 