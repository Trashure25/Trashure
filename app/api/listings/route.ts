import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create listing using Prisma
    const listing = await prisma.listing.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        price: data.price,
        brand: data.brand || null,
        size: data.size || null,
        images: data.images || [],
        status: data.status || 'active',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/listings - Starting request')
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('Database URL exists:', !!process.env.DATABASE_URL)
    console.log('Prisma client initialized:', !!prisma)

    // Fetch listings using Prisma
    const listings = await prisma.listing.findMany({
      where: {
        status: 'active',
        ...(userId && { userId })
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${listings.length} listings`)
    return NextResponse.json(listings);

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 