import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = params

    // Get the listing
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            credits: true,
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check if listing is active
    if (listing.status !== 'active') {
      return NextResponse.json({ error: 'Listing is not available for purchase' }, { status: 400 })
    }

    // Check if user is trying to buy their own listing
    if (listing.userId === currentUser.id) {
      return NextResponse.json({ error: 'Cannot purchase your own listing' }, { status: 400 })
    }

    // Check if user has enough credits
    if (currentUser.credits < listing.price) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Execute the purchase
    await prisma.$transaction(async (tx) => {
      // Double-check that listing is still available and user has enough credits
      const currentListing = await tx.listing.findUnique({
        where: { id },
        include: { user: { select: { credits: true } } }
      })
      
      if (!currentListing || currentListing.status !== 'active') {
        throw new Error('Listing is no longer available')
      }
      
      const currentUserData = await tx.user.findUnique({
        where: { id: currentUser.id },
        select: { credits: true }
      })
      
      if (!currentUserData || currentUserData.credits < listing.price) {
        throw new Error('Insufficient credits')
      }

      // Transfer credits from buyer to seller
      await tx.user.update({
        where: { id: currentUser.id },
        data: { credits: { decrement: listing.price } }
      })

      await tx.user.update({
        where: { id: listing.userId },
        data: { credits: { increment: listing.price } }
      })

      // Update listing status to sold
      await tx.listing.update({
        where: { id },
        data: { status: 'sold' }
      })

      // Update trust scores
      await tx.user.update({
        where: { id: currentUser.id },
        data: { trustScore: { increment: 3 } }
      })

      await tx.user.update({
        where: { id: listing.userId },
        data: { trustScore: { increment: 3 } }
      })
    })

    return NextResponse.json({ 
      message: 'Purchase completed successfully',
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        status: 'sold'
      }
    })
  } catch (error) {
    console.error('Error purchasing listing:', error)
    return NextResponse.json(
      { error: 'Failed to complete purchase' },
      { status: 500 }
    )
  }
} 