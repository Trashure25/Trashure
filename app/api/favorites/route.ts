import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, listingId } = await req.json();

    // Validate required fields
    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'User ID and Listing ID are required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId) || !uuidRegex.test(listingId)) {
      return NextResponse.json(
        { error: 'Invalid User ID or Listing ID format' },
        { status: 400 }
      );
    }

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Check if favorite already exists with retry logic
    const existingFavorite = await withRetry(async () => {
      return await prisma.favorite.findFirst({
        where: {
          userId,
          listingId,
        },
      });
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Item is already favorited' },
        { status: 409 }
      );
    }

    // Verify that the listing exists
    const listing = await withRetry(async () => {
      return await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, status: true }
      });
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Cannot favorite inactive listing' },
        { status: 400 }
      );
    }

    // Create favorite with retry logic
    const favorite = await withRetry(async () => {
      return await prisma.favorite.create({
        data: {
          userId,
          listingId,
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
      });
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    
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
        { error: 'Database connection failed', details: error.message },
        { status: 503 }
      );
    }
    
    // Check for foreign key constraint violations
    if (error instanceof Error && error.message.includes('Foreign key constraint failed')) {
      return NextResponse.json(
        { error: 'Invalid User ID or Listing ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add favorite', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid User ID format' },
        { status: 400 }
      );
    }

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch favorites with pagination and retry logic
    const [favorites, totalCount] = await withRetry(async () => {
      const [favoritesResult, countResult] = await Promise.all([
        prisma.favorite.findMany({
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
          skip,
          take: limit,
        }),
        prisma.favorite.count({
          where: { userId }
        })
      ]);
      
      return [favoritesResult, countResult];
    });

    // Return paginated response
    return NextResponse.json({
      favorites,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    
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
        { error: 'Database connection failed', details: error.message },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch favorites', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 