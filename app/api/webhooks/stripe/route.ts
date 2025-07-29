import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment succeeded:', paymentIntent.id)
      
      try {
        const userId = paymentIntent.metadata.userId
        const credits = parseInt(paymentIntent.metadata.credits || '0')
        
        if (userId && credits > 0) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: credits
              }
            }
          })
          console.log(`Added ${credits} credits to user ${userId}`)
        }
      } catch (error) {
        console.error('Error updating user credits:', error)
        return NextResponse.json({ error: 'Failed to update user credits' }, { status: 500 })
      }
      break
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', failedPayment.id)
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
} 