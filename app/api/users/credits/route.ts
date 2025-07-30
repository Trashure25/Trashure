import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// POST /api/users/credits - Update user credits
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

    const { userId, credits } = await request.json()

    // Validate input
    if (!userId || typeof credits !== 'number' || credits <= 0) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    // Ensure user can only update their own credits
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
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

    // Update user credits
    const updatedUser = await withRetry(async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits
          }
        },
        select: {
          id: true,
          credits: true
        }
      })
    })

    return NextResponse.json({
      success: true,
      credits: updatedUser.credits
    })
  } catch (error) {
    console.error('Error updating user credits:', error)
    return NextResponse.json(
      { error: 'Failed to update credits' },
      { status: 500 }
    )
  }
} 