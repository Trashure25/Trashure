// Run this route on the Node runtime (not the default browser runtime)
export const runtime = "nodejs"

import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount?: number
      credits?: number
      description?: string
    }
    const amount = Number.parseInt(String(body.amount ?? 0), 10)
    const credits = Number.parseInt(String(body.credits ?? 0), 10)
    const description = body.description ?? `Purchase of ${credits} credits`

    const user = await auth.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    if (!amount || amount < 50) {
      // Stripe minimum is 50 cents in test/live mode
      return NextResponse.json({ error: "Invalid amount (minimum $0.50)" }, { status: 400 })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      description: description || `Purchase of ${credits} credits`,
      receipt_email: user.email,
      metadata: {
        userId: user.id,
        credits: credits,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Stripe PaymentIntent error:", error)
    const message =
      typeof error?.message === "string" ? error.message : "Stripe failed to create a PaymentIntent. Check server logs."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
