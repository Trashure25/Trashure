import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  const results = {
    envCheck: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'Not set',
    },
    connectionTests: [] as any[]
  };

  // Test 1: Direct Prisma connection
  try {
    console.log('Testing direct Prisma connection...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    await prisma.$connect();
    const userCount = await prisma.user.count();
    await prisma.$disconnect();
    
    results.connectionTests.push({
      method: 'Direct Prisma',
      success: true,
      userCount,
      error: null
    });
  } catch (error) {
    results.connectionTests.push({
      method: 'Direct Prisma',
      success: false,
      userCount: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Try with connection pooling
  try {
    console.log('Testing with connection pooling...');
    const pooledUrl = process.env.DATABASE_URL?.replace(':5432/', ':6543/');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: pooledUrl,
        },
      },
    });
    
    await prisma.$connect();
    const userCount = await prisma.user.count();
    await prisma.$disconnect();
    
    results.connectionTests.push({
      method: 'Connection Pooling',
      success: true,
      userCount,
      error: null
    });
  } catch (error) {
    results.connectionTests.push({
      method: 'Connection Pooling',
      success: false,
      userCount: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Check if it's a timeout issue
  try {
    console.log('Testing with timeout...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    const connectionPromise = prisma.$connect();
    await Promise.race([connectionPromise, timeoutPromise]);
    
    const userCount = await prisma.user.count();
    await prisma.$disconnect();
    
    results.connectionTests.push({
      method: 'With Timeout',
      success: true,
      userCount,
      error: null
    });
  } catch (error) {
    results.connectionTests.push({
      method: 'With Timeout',
      success: false,
      userCount: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return NextResponse.json(results);
} 