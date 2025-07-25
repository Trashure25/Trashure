import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';

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

    const data = await req.json();

    // Check if user already exists with retry logic
    const existingUser = await withRetry(async () => {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username }
          ]
        },
        select: {
          id: true,
          email: true,
          username: true
        }
      });
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return NextResponse.json(
          { message: 'An account with this email already exists' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: 'This username is already taken' },
          { status: 400 }
        );
      }
    }

    // Create new user with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: data.password, // TODO: Hash this in production!
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${data.firstName} ${data.lastName}`,
          trustScore: 50,
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

    return NextResponse.json(user);

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
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
