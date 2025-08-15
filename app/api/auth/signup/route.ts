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

    const { email, password, username, firstName, lastName } = await req.json();
    
    if (!email || !password || !username || !firstName || !lastName) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Check for at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      }, { status: 400 });
    }

    // Check for common weak passwords
    const weakPasswords = ['12345678', 'password', 'password123', 'qwerty', 'abc123', '123456789'];
    if (weakPasswords.includes(password.toLowerCase())) {
      return NextResponse.json({ message: 'Please choose a stronger password' }, { status: 400 });
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
          createdAt: true,
          updatedAt: true,
        }
      });
    });



    // Create JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    // Set cookie
    const response = NextResponse.json({
      ...newUser
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