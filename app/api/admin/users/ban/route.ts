import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

// POST /api/admin/users/ban - Ban a user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { userId, reason, duration } = await request.json()

    // Validate input
    if (!userId || !reason) {
      return NextResponse.json(
        { error: 'User ID and reason are required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // Prevent self-banning
    if (user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot ban yourself' },
        { status: 400 }
      )
    }

    // Test database connection
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Check if user exists
    const targetUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, isBanned: true }
      })
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (targetUser.isBanned) {
      return NextResponse.json(
        { error: 'User is already banned' },
        { status: 400 }
      )
    }

    // Ban the user
    await withRetry(async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: true,
          banReason: reason
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'User banned successfully'
    })
  } catch (error) {
    console.error('Error banning user:', error)
    return NextResponse.json(
      { error: 'Failed to ban user' },
      { status: 500 }
    )
  }
} 