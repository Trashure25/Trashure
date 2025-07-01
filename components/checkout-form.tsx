"use client"

import { useState, type FormEvent } from "react"
import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CheckoutFormProps {
  credits: number
  amount: number
}

export function CheckoutForm({ credits, amount }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-success?credits=${credits}`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message || "An unexpected error occurred.")
    } else {
      setErrorMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      id="payment-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </span>
      </Button>

      {/* Show any error or success messages */}
      {errorMessage && (
        <div id="payment-message" className="text-red-600 text-sm text-center">
          {errorMessage}
        </div>
      )}
    </motion.form>
  )
}
