import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

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

    const { email, password, username, firstName, lastName } = await req.json();
    
    if (!email || !password || !username || !firstName || !lastName) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await withRetry(async () => {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with retry logic
    const newUser = await withRetry(async () => {
      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          firstName,
          lastName,
          emailVerified: false, // Users start unverified
          // trustScore will use the default value of 70 from the schema
        },
        select: {
          id: true,
          email: true,
          username: true,
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

    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: newUser.id,
        token: verificationToken,
        expiresAt
      }
    });

    // Create verification link
    const verificationLink = `${req.nextUrl.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationLink, firstName);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Continue with signup even if email fails - user can request resend later
    }

    // Create JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    // Set cookie
    const response = NextResponse.json({
      ...newUser,
      verificationLink // Keep for demo purposes
    });
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
    console.error('Signup error:', error);
    
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