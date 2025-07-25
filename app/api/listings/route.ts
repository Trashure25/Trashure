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

    // Validate required fields
    if (!data.userId || !data.title || !data.description || !data.category || !data.condition || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price
    if (data.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create listing using Prisma with retry logic
    const listing = await withRetry(async () => {
      return await prisma.listing.create({
        data: {
          userId: data.userId,
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category,
          condition: data.condition,
          price: data.price,
          brand: data.brand?.trim() || null,
          size: data.size?.trim() || null,
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
    
    // Parse query parameters
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100 items per page
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('Database URL exists:', !!process.env.DATABASE_URL)
    console.log('Prisma client initialized:', !!prisma)

    // Test database connection first (but be lenient in development)
    const isConnected = await testDatabaseConnection();
    console.log('Database connection test result:', isConnected);
    
    if (!isConnected && process.env.NODE_ENV === 'production') {
      console.error('Database connection failed, returning error')
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Build where clause
    const where: any = {
      status: status,
      ...(userId && { userId }),
      ...(category && { category }),
      ...(brand && { brand }),
    };

    console.log('Query where clause:', where);

    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'price', 'title'];
    const validSortOrders = ['asc', 'desc'];
    
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sort field' },
        { status: 400 }
      );
    }
    
    if (!validSortOrders.includes(sortOrder)) {
      return NextResponse.json(
        { error: 'Invalid sort order' },
        { status: 400 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Attempting to fetch listings...');

    // Fetch listings with pagination using Prisma with retry logic
    const [listings, totalCount] = await withRetry(async () => {
      console.log('Executing database query...');
      const [listingsResult, countResult] = await Promise.all([
        prisma.listing.findMany({
          where,
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
            [sortBy]: sortOrder as 'asc' | 'desc'
          },
          skip,
          take: limit,
        }),
        prisma.listing.count({ where })
      ]);
      
      console.log('Database query successful');
      console.log('Listings found:', listingsResult.length);
      console.log('Total count:', countResult);
      
      return [listingsResult, countResult];
    });

    console.log(`Successfully fetched ${listings.length} listings (page ${page} of ${Math.ceil(totalCount / limit)})`)
    
    // Validate that we got a proper response
    if (!Array.isArray(listings)) {
      console.error('Invalid response from database:', listings)
      return NextResponse.json(
        { error: 'Invalid database response' },
        { status: 500 }
      );
    }

    // Return paginated response
    return NextResponse.json({
      listings,
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