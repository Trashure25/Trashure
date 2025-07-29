"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { PageTransition } from "@/components/page-transition"
import { TrashureFooter } from "@/components/trashure-footer"
import { CheckoutForm } from "@/components/checkout-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const { currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [amount, setAmount] = useState(0)
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login?redirect=/checkout")
      return
    }
  }, [authLoading, currentUser, router])

  useEffect(() => {
    // Don't proceed if not authenticated
    if (authLoading || !currentUser) {
      return
    }

    const amountParam = Number.parseInt(searchParams.get("amount") || "0")
    const creditsParam = Number.parseInt(searchParams.get("credits") || "0")
    const descriptionParam = searchParams.get("description") || `Purchase of ${creditsParam} credits`

    if (amountParam > 0) {
      setAmount(amountParam)
      setCredits(creditsParam)

      // Check if Stripe key is available
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        setError("Stripe configuration is missing. Please contact support.")
        setIsLoading(false)
        return
      }

      // Create PaymentIntent as soon as the page loads
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountParam, credits: creditsParam, description: descriptionParam }),
      })
        .then(async (res) => {
          if (!res.ok) {
            // API returned an error (plain-text). Read the text safely.
            const msg = await res.text()
            console.error("Payment intent creation failed:", res.status, msg)
            throw new Error(msg || `Payment setup failed (${res.status}). Please try again.`)
          }
          return res.json() // Safe: we already confirmed res.ok
        })
        .then((data) => {
          if (!data?.clientSecret) {
            console.error("Missing client secret in response:", data)
            throw new Error("Payment setup incomplete. Please try again.")
          }
          setClientSecret(data.clientSecret)
          setIsLoading(false)
        })
        .catch((err: any) => {
          console.error("Failed to create payment intent:", err)
          setError(
            typeof err?.message === "string"
              ? err.message
              : "Failed to start checkout. Please try again or contact support.",
          )
          setIsLoading(false)
        })
    } else {
      setError("Invalid purchase amount. Please try again.")
      setIsLoading(false)
    }
  }, [searchParams, authLoading, currentUser])

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#047857", // Your primary green color
    },
  }
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-black mb-2">Secure Checkout</h1>
              <p className="text-gray-600">Complete your purchase to add credits to your account.</p>
            </motion.div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  You are purchasing <span className="font-bold text-primary">{credits} credits</span> for{" "}
                  <span className="font-bold text-primary">${(amount / 100).toFixed(2)}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Preparing your secure checkout...</p>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600 py-8">
                    <p>{error}</p>
                  </div>
                ) : clientSecret ? (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm credits={credits} amount={amount} />
                  </Elements>
                ) : (
                  <div className="text-center text-red-600 py-8">
                    <p>Could not initialize checkout. Please try again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <TrashureFooter />
      </div>
    </PageTransition>
  )
}
