import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 })
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Get the credits from metadata
    const credits = parseInt(paymentIntent.metadata.credits || '0')
    if (credits <= 0) {
      return NextResponse.json({ error: 'Invalid credits amount' }, { status: 400 })
    }

    // Add credits to user's account
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        credits: {
          increment: credits
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      creditsAdded: credits,
      message: `Successfully added ${credits} credits to your account`
    })
  } catch (error) {
    console.error('Error processing payment success:', error)
    return NextResponse.json(
      { error: 'Failed to process payment success' },
      { status: 500 }
    )
  }
} 