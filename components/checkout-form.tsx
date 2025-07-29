"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function CheckoutForm({ credits, amount }: { credits: number; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.")
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?credits=${credits}&amount=${amount}`,
        },
        redirect: "if_required",
      })

      if (error) {
        toast.error(error.message || "Payment failed. Please try again.")
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Call our API to add credits
        const response = await fetch("/api/payment-success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          toast.success(result.message || `Successfully added ${credits} credits!`)
          router.push("/payment-success?credits=" + credits)
        } else {
          toast.error("Payment succeeded but failed to add credits. Please contact support.")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)} for ${credits} Credits`
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. You will receive ${credits} credits upon successful payment.
      </p>
    </form>
  )
}
