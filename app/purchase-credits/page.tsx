"use client"

import { useRouter } from "next/navigation"
import { TrashureFooter } from "@/components/trashure-footer"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

const creditPackages = [
  { dollars: 5, credits: 50, bonus: 0, popular: false },
  { dollars: 20, credits: 200, bonus: 25, popular: true },
  { dollars: 50, credits: 500, bonus: 100, popular: false },
  { dollars: 100, credits: 1000, bonus: 250, popular: false },
  { dollars: 500, credits: 5000, bonus: 700, popular: false },
  { dollars: 1000, credits: 10000, bonus: 1200, popular: false },
]

export default function PurchaseCreditsPage() {
  const router = useRouter()
  const { currentUser, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login")
    }
  }, [isLoading, currentUser, router])

  const handlePurchase = (pkg: { dollars: number; credits: number; bonus: number; popular: boolean }) => {
    const amountInCents = pkg.dollars * 100
    const totalCredits = pkg.credits + pkg.bonus
    router.push(`/checkout?amount=${amountInCents}&credits=${totalCredits}`)
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-black mb-2">Purchase Credits</h1>
            <p className="text-lg text-gray-600">Top up your balance to exchange for amazing items. 10 Credits = $1.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {creditPackages.map((pkg, index) => (
              <motion.div
                key={pkg.dollars}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "text-center transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full",
                    pkg.popular && "border-primary border-2 relative",
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold rounded-full shadow-lg">
                      POPULAR
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-4xl font-extrabold text-primary">{pkg.credits + pkg.bonus}</CardTitle>
                    <CardDescription className="text-lg">Credits</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-end">
                    {pkg.bonus > 0 && (
                      <p className="text-sm text-primary font-semibold mb-4">INCLUDES +{pkg.bonus} BONUS CREDITS</p>
                    )}
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      className="w-full mt-auto bg-black hover:bg-gray-800 text-white font-bold py-3 text-lg"
                    >
                      ${pkg.dollars}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
