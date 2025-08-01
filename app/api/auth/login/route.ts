import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 503 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Use Prisma with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          trustScore: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({ 
        message: 'Please verify your email address before logging in. Check your inbox for a verification link.',
        requiresVerification: true 
      }, { status: 403 });
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    // Set cookie
    const response = NextResponse.json(userWithoutPassword);
    const secureFlag = process.env.NODE_ENV === 'production';
    response.cookies.set('trashure_jwt', token, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });



    return response;
  } catch (error) {
    console.error('Login error:', error);
    
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
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 