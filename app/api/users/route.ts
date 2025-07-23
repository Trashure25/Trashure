import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
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

    // TODO: Add proper password hashing!
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password, // Hash this in production!
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

    return NextResponse.json(user);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
