import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// GET /api/messages/conversations - Get all conversations for a user
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

    // Get conversations where user is either user1 or user2
    const conversations = await withRetry(async () => {
      return await prisma.conversation.findMany({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        },
        include: {
          user1: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            }
          },
          user2: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            }
          },
          listing: {
            select: {
              id: true,
              title: true,
              images: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  AND: [
                    { read: false },
                    { senderId: { not: userId } }
                  ]
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    })

    // Transform the data to match our interface
    const transformedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1
      const lastMessage = conv.messages[0]
      
      return {
        id: conv.id,
        user1Id: conv.user1Id,
        user2Id: conv.user2Id,
        listingId: conv.listingId,
        listing: conv.listing ? {
          id: conv.listing.id,
          title: conv.listing.title,
          images: conv.listing.images,
        } : undefined,
        otherUser: {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          username: otherUser.username,
          avatarUrl: otherUser.avatarUrl,
        },
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          conversationId: lastMessage.conversationId,
          senderId: lastMessage.senderId,
          senderName: `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`,
          content: lastMessage.content,
          read: lastMessage.read,
          createdAt: lastMessage.createdAt.toISOString(),
        } : undefined,
        unreadCount: conv._count.messages,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
      }
    })

    return NextResponse.json({ conversations: transformedConversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/messages/conversations - Create a new conversation
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
    const { otherUserId, listingId, initialMessage } = body

    if (!otherUserId || !initialMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate that the other user exists
    const otherUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true }
      })
    })

    if (!otherUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if conversation already exists
    const existingConversation = await withRetry(async () => {
      return await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              AND: [
                { user1Id: user.id },
                { user2Id: otherUserId },
                { listingId: listingId || null }
              ]
            },
            {
              AND: [
                { user1Id: otherUserId },
                { user2Id: user.id },
                { listingId: listingId || null }
              ]
            }
          ]
        }
      })
    })

    if (existingConversation) {
      // If conversation exists, just send the message
      const message = await withRetry(async () => {
        return await prisma.message.create({
          data: {
            conversationId: existingConversation.id,
            senderId: user.id,
            content: initialMessage,
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
          where: { id: existingConversation.id },
          data: { updatedAt: new Date() }
        })
      })

      return NextResponse.json({
        id: existingConversation.id,
        message: {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: `${message.sender.firstName} ${message.sender.lastName}`,
          content: message.content,
          read: message.read,
          createdAt: message.createdAt.toISOString(),
        }
      })
    }

    // Create new conversation and message
    const result = await withRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
          data: {
            user1Id: user.id,
            user2Id: otherUserId,
            listingId: listingId || null,
          },
          include: {
            user1: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              }
            },
            user2: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              }
            },
            listing: {
              select: {
                id: true,
                title: true,
                images: true,
              }
            }
          }
        })

        const message = await tx.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: initialMessage,
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

        return { conversation, message }
      })
    })

    const otherUserData = result.conversation.user1Id === user.id 
      ? result.conversation.user2 
      : result.conversation.user1

    return NextResponse.json({
      id: result.conversation.id,
      user1Id: result.conversation.user1Id,
      user2Id: result.conversation.user2Id,
      listingId: result.conversation.listingId,
      listing: result.conversation.listing ? {
        id: result.conversation.listing.id,
        title: result.conversation.listing.title,
        images: result.conversation.listing.images,
      } : undefined,
      otherUser: {
        id: otherUserData.id,
        firstName: otherUserData.firstName,
        lastName: otherUserData.lastName,
        username: otherUserData.username,
        avatarUrl: otherUserData.avatarUrl,
      },
      lastMessage: {
        id: result.message.id,
        conversationId: result.message.conversationId,
        senderId: result.message.senderId,
        senderName: `${result.message.sender.firstName} ${result.message.sender.lastName}`,
        content: result.message.content,
        read: result.message.read,
        createdAt: result.message.createdAt.toISOString(),
      },
      unreadCount: 0,
      createdAt: result.conversation.createdAt.toISOString(),
      updatedAt: result.conversation.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
} 