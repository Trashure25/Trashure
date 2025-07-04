"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const creditsAdded = Number.parseInt(searchParams.get("credits") || "0")

  useEffect(() => {
    const updateUserCredits = async () => {
      if (creditsAdded > 0) {
        try {
          const user = await auth.getCurrentUser()
          if (user) {
            await auth.updateUserCredits(user.id, creditsAdded)
          } else {
            throw new Error("User not found")
          }
        } catch (err) {
          setError("Failed to update your credits. Please contact support.")
        }
      }
      setIsLoading(false)
    }

    updateUserCredits()
  }, [creditsAdded])

  return (
    <PageTransition>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 max-w-md"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-black mb-4">Processing your payment...</h1>
              <p className="text-gray-600">Please wait while we update your account.</p>
            </>
          ) : error ? (
            <>
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push("/profile")}>Go to My Profile</Button>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-black mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                <span className="font-bold text-primary">{creditsAdded} credits</span> have been added to your account.
              </p>
              <Button onClick={() => router.push("/profile")}>Go to My Profile</Button>
            </>
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
