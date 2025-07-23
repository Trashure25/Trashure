import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting login for email:', email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // TODO: Add proper password hashing and comparison
    // For now, we'll do a simple comparison (NOT secure for production!)
    if (user.password !== password) {
      console.log('Password mismatch for user:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Login successful for user:', email);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Login error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 