import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trashure_jwt')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: (payload as any).userId },
      select: {
        id: true, email: true, username: true, firstName: true, lastName: true, avatarUrl: true, trustScore: true, createdAt: true, updatedAt: true
      }
    });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
} 