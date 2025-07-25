import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, listingId } = await req.json();

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'User ID and Listing ID are required' },
        { status: 400 }
      );
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        listingId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Item is already favorited' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            brand: true,
            size: true,
            condition: true,
            category: true,
            images: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
} 