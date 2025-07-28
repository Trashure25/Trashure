import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'

// GET /api/users/profile/[username] - Get user profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    const { username } = params

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      )
    }

    // Fetch user by username
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          avatarUrl: true,
          trustScore: true,
          createdAt: true,
          updatedAt: true
        }
      })
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
} 