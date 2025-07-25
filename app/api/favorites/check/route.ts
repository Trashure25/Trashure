import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'User ID and Listing ID are required' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        listingId,
      },
    });

    return NextResponse.json({
      isFavorited: !!favorite,
      favoriteId: favorite?.id || null,
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite' },
      { status: 500 }
    );
  }
} 