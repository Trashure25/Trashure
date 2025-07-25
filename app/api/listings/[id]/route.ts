import { NextRequest, NextResponse } from 'next/server';
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('GET /api/listings/[id] - Starting request for ID:', params.id)
    
    // Validate ID parameter
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
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

    // Fetch listing with retry logic
    const listing = await withRetry(async () => {
      return await prisma.listing.findUnique({
        where: { id: params.id },
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

    if (!listing) {
      console.log('Listing not found for ID:', params.id)
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    console.log('Found listing:', listing.id)
    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error fetching listing:', error);
    
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
      { error: 'Failed to fetch listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID parameter
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.condition || !data.price) {
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

    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Update listing with retry logic
    const listing = await withRetry(async () => {
      return await prisma.listing.update({
        where: { id: params.id },
        data: {
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
    console.error('Error updating listing:', error);
    
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
    
    // Check if it's a not found error
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID parameter
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
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

    // Delete listing with retry logic
    await withRetry(async () => {
      return await prisma.listing.delete({
        where: { id: params.id }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting listing:', error);
    
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
    
    // Check if it's a not found error
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 