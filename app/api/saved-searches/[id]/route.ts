import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Update a saved search
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { name, query, filters, emailNotifications } = await req.json();
    
    const savedSearch = await prisma.savedSearch.findFirst({
      where: { id: params.id, userId: payload.userId }
    });
    
    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }
    
    const updatedSearch = await prisma.savedSearch.update({
      where: { id: params.id },
      data: {
        name,
        query,
        filters,
        emailNotifications
      }
    });
    
    return NextResponse.json({ savedSearch: updatedSearch });
    
  } catch (error) {
    console.error('Update saved search error:', error);
    return NextResponse.json({ error: 'Failed to update saved search' }, { status: 500 });
  }
}

// Delete a saved search
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const savedSearch = await prisma.savedSearch.findFirst({
      where: { id: params.id, userId: payload.userId }
    });
    
    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
    }
    
    await prisma.savedSearch.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete saved search error:', error);
    return NextResponse.json({ error: 'Failed to delete saved search' }, { status: 500 });
  }
} 