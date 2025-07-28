import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

// GET /api/messages/unread-count - Get unread message count for a user
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Get user from auth
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get unread message count
    const count = await withRetry(async () => {
      return await prisma.message.count({
        where: {
          conversation: {
            OR: [
              { user1Id: userId },
              { user2Id: userId }
            ]
          },
          senderId: { not: userId },
          read: false
        }
      })
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
} 