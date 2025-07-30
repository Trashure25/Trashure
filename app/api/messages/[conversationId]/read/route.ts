import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// POST /api/messages/[conversationId]/read - Mark messages as read
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
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

    // Get user from auth
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { conversationId } = params
    const body = await request.json()
    const { userId } = body

    if (!userId || userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate conversationId format
    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      )
    }

    // Check if user is part of this conversation
    const conversation = await withRetry(async () => {
      return await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { user1Id: user.id },
            { user2Id: user.id }
          ]
        }
      })
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Mark all unread messages from other users as read
    await withRetry(async () => {
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: user.id },
          read: false
        },
        data: { read: true }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
} 