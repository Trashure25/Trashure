import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Test the connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Get a sample user
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      sampleUser,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 