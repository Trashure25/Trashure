import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Create listing using Prisma with retry logic
    const listing = await withRetry(async () => {
      return await prisma.listing.create({
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
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing', details: error instanceof Error ? error.message : 'Unknown error' },
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

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection failed, returning error')
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Fetch listings using Prisma with retry logic
    const listings = await withRetry(async () => {
      return await prisma.listing.findMany({
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
    });

    console.log(`Successfully fetched ${listings.length} listings`)
    
    // Validate that we got a proper response
    if (!Array.isArray(listings)) {
      console.error('Invalid response from database:', listings)
      return NextResponse.json(
        { error: 'Invalid database response' },
        { status: 500 }
      );
    }

    return NextResponse.json(listings);

  } catch (error) {
    console.error('Error fetching listings:', error);
    
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
      { error: 'Failed to fetch listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 