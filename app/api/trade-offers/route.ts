import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

// Helper function to expire old trade offers
async function expireOldTradeOffers() {
  await prisma.tradeOffer.updateMany({
    where: {
      status: 'pending',
      expiresAt: {
        lt: new Date()
      }
    },
    data: {
      status: 'expired'
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { 
      conversationId, 
      receiverId, 
      offeredListingId, 
      requestedListingId, 
      additionalCredits 
    } = await req.json()

    // Validate required fields
    if (!conversationId || !receiverId || !requestedListingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user is trying to trade with themselves
    if (currentUser.id === receiverId) {
      return NextResponse.json({ error: 'Cannot trade with yourself' }, { status: 400 })
    }

    // Check if user has enough credits
    if (additionalCredits > currentUser.credits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Validate that user owns the offered listing if one is provided
    if (offeredListingId) {
      const offeredListing = await prisma.listing.findUnique({
        where: { id: offeredListingId }
      })
      
      if (!offeredListing) {
        return NextResponse.json({ error: 'Offered listing not found' }, { status: 404 })
      }
      
      if (offeredListing.userId !== currentUser.id) {
        return NextResponse.json({ error: 'You do not own the offered listing' }, { status: 403 })
      }
      
      if (offeredListing.status !== 'active') {
        return NextResponse.json({ error: 'Offered listing is not available for trade' }, { status: 400 })
      }
    }

    // Validate the requested listing
    const requestedListing = await prisma.listing.findUnique({
      where: { id: requestedListingId }
    })
    
    if (!requestedListing) {
      return NextResponse.json({ error: 'Requested listing not found' }, { status: 404 })
    }
    
    if (requestedListing.userId !== receiverId) {
      return NextResponse.json({ error: 'Requested listing does not belong to the receiver' }, { status: 400 })
    }
    
    if (requestedListing.status !== 'active') {
      return NextResponse.json({ error: 'Requested listing is not available for trade' }, { status: 400 })
    }

    // Create trade offer
    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        receiverId,
        offeredListingId,
        requestedListingId,
        additionalCredits,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        sender: { select: { id: true, username: true, firstName: true, lastName: true } },
        receiver: { select: { id: true, username: true, firstName: true, lastName: true } },
        offeredListing: { select: { id: true, title: true, price: true, images: true } },
        requestedListing: { select: { id: true, title: true, price: true, images: true } },
      }
    })

    return NextResponse.json(tradeOffer)
  } catch (error) {
    console.error('Error creating trade offer:', error)
    return NextResponse.json(
      { error: 'Failed to create trade offer' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    // Expire old trade offers first
    await expireOldTradeOffers()

    // Get trade offers for this conversation
    const tradeOffers = await prisma.tradeOffer.findMany({
      where: {
        conversationId,
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id }
        ]
      },
      include: {
        sender: { select: { id: true, username: true, firstName: true, lastName: true } },
        receiver: { select: { id: true, username: true, firstName: true, lastName: true } },
        offeredListing: { select: { id: true, title: true, price: true, images: true } },
        requestedListing: { select: { id: true, title: true, price: true, images: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tradeOffers)
  } catch (error) {
    console.error('Error fetching trade offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trade offers' },
      { status: 500 }
    )
  }
} 