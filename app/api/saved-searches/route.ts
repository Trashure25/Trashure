import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Get all saved searches for the current user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trashure_jwt')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate JWT token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: payload.userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ savedSearches });
    
  } catch (error) {
    console.error('Get saved searches error:', error);
    return NextResponse.json({ error: 'Failed to get saved searches' }, { status: 500 });
  }
}

// Create a new saved search
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('trashure_jwt')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate JWT token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    
    const { name, query, filters, emailNotifications = true } = await req.json();
    
    if (!name || !query) {
      return NextResponse.json({ error: 'Name and query are required' }, { status: 400 });
    }
    
    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: payload.userId,
        name,
        query,
        filters,
        emailNotifications
      }
    });
    
    return NextResponse.json({ savedSearch });
    
  } catch (error) {
    console.error('Create saved search error:', error);
    return NextResponse.json({ error: 'Failed to create saved search' }, { status: 500 });
  }
} 