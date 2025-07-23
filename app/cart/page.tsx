"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
// import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, ShoppingBag, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Loading from "@/components/loading"

export default function CartPage() {
  const { currentUser } = useAuth()
  // const { cart, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [items, setItems] = useState([
    {
      id: "1",
      name: "AI-Powered Toaster",
      seller: "Tech Gadgets Inc.",
      price: 79,
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Self-Stirring Mug",
      seller: "Novelty Goods Co.",
      price: 29,
      image: "/placeholder.svg",
    },
  ])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Loading />
  }

  const totalCost = items.reduce((acc, item) => acc + item.price, 0)
  const userCredits = currentUser?.credits ?? 0
  const hasSufficientCredits = userCredits >= totalCost
  const creditsNeeded = totalCost - userCredits

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const handleRemoveItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-oswald">Shopping Cart</h1>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <ul className="space-y-6">
              {items.map((item) => (
                <motion.li key={item.id} variants={itemVariants}>
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex items-start gap-6">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover aspect-square"
                      />
                      <div className="flex-grow">
                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">Don&apos;t forget your items!</p>
                        <p className="text-lg font-bold text-gray-900 mt-4">{item.price} Credits</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-oswald">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <span>Items ({items.length})</span>
                  <span>{totalCost} Credits</span>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <span>Transaction Fee</span>
                  <span>0 Credits</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{totalCost} Credits</span>
                </div>
                <Separator />
                {!hasSufficientCredits && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Insufficient Credits</p>
                      <p className="text-sm">
                        Your balance is {userCredits} Credits. You need {creditsNeeded} more.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-4">
                {hasSufficientCredits ? (
                  <Button size="lg" className="w-full" onClick={() => alert("Proceeding to checkout!")}>
                    Complete Exchange
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={() => router.push("/purchase-credits")}>
                    Purchase Credits
                  </Button>
                )}
                <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
