import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = params
    const { action } = await req.json()

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get the trade offer
    const tradeOffer = await prisma.tradeOffer.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        offeredListing: true,
        requestedListing: true,
      }
    })

    if (!tradeOffer) {
      return NextResponse.json({ error: 'Trade offer not found' }, { status: 404 })
    }

    // Check if current user is the receiver
    if (tradeOffer.receiverId !== currentUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if trade offer is still pending
    if (tradeOffer.status !== 'pending') {
      return NextResponse.json({ error: 'Trade offer is no longer pending' }, { status: 400 })
    }

    // Check if trade offer has expired
    if (new Date() > tradeOffer.expiresAt) {
      return NextResponse.json({ error: 'Trade offer has expired' }, { status: 400 })
    }

    if (action === 'accept') {
      // Check if sender still has enough credits
      if (tradeOffer.additionalCredits > tradeOffer.sender.credits) {
        return NextResponse.json({ error: 'Sender no longer has sufficient credits' }, { status: 400 })
      }

      // Check if listings are still available
      if (tradeOffer.offeredListing && tradeOffer.offeredListing.status !== 'active') {
        return NextResponse.json({ error: 'Offered listing is no longer available' }, { status: 400 })
      }

      if (tradeOffer.requestedListing.status !== 'active') {
        return NextResponse.json({ error: 'Requested listing is no longer available' }, { status: 400 })
      }

      // Execute the trade
      await prisma.$transaction(async (tx) => {
        // Update trade offer status
        await tx.tradeOffer.update({
          where: { id },
          data: { status: 'accepted' }
        })

        // Transfer credits
        if (tradeOffer.additionalCredits > 0) {
          await tx.user.update({
            where: { id: tradeOffer.senderId },
            data: { credits: { decrement: tradeOffer.additionalCredits } }
          })

          await tx.user.update({
            where: { id: tradeOffer.receiverId },
            data: { credits: { increment: tradeOffer.additionalCredits } }
          })
        }

        // Update listing ownership if there's an offered listing
        if (tradeOffer.offeredListingId) {
          await tx.listing.update({
            where: { id: tradeOffer.offeredListingId },
            data: { userId: tradeOffer.receiverId }
          })

          await tx.listing.update({
            where: { id: tradeOffer.requestedListingId },
            data: { userId: tradeOffer.senderId }
          })
        } else {
          // Just transfer the requested listing
          await tx.listing.update({
            where: { id: tradeOffer.requestedListingId },
            data: { userId: tradeOffer.senderId }
          })
        }

        // Update trust scores
        await tx.user.update({
          where: { id: tradeOffer.senderId },
          data: { trustScore: { increment: 5 } }
        })

        await tx.user.update({
          where: { id: tradeOffer.receiverId },
          data: { trustScore: { increment: 5 } }
        })
      })

      return NextResponse.json({ message: 'Trade offer accepted successfully' })
    } else {
      // Decline the trade offer
      await prisma.tradeOffer.update({
        where: { id },
        data: { status: 'declined' }
      })

      return NextResponse.json({ message: 'Trade offer declined' })
    }
  } catch (error) {
    console.error('Error responding to trade offer:', error)
    return NextResponse.json(
      { error: 'Failed to respond to trade offer' },
      { status: 500 }
    )
  }
} 