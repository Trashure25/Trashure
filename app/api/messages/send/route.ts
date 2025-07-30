import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// POST /api/messages/send - Send a new message
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { conversationId, content } = body

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate conversationId format
    if (typeof conversationId !== 'string') {
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

    // Create the message
    const message = await withRetry(async () => {
      return await prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
          content: content.trim(),
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      })
    })

    // Update conversation timestamp
    await withRetry(async () => {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      })
    })

    return NextResponse.json({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: `${message.sender.firstName} ${message.sender.lastName}`,
      content: message.content,
      read: message.read,
      createdAt: message.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 