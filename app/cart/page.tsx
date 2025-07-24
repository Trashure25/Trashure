"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, ShoppingBag, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Loading from "@/components/loading"

interface CartItem {
  id: string
  name: string
  seller: string
  price: number
  image: string
}

export default function CartPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    loadCartItems()
  }, [currentUser])

  const loadCartItems = () => {
    if (!currentUser) {
      setItems([])
      setIsLoading(false)
      return
    }

    try {
      const cartKey = `trashure_cart_${currentUser.id}`
      const cartData = localStorage.getItem(cartKey)
      const cartItems = cartData ? JSON.parse(cartData) : []
      setItems(cartItems)
    } catch (error) {
      console.error('Error loading cart:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = (id: string) => {
    if (!currentUser) return

    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    
    // Update localStorage
    const cartKey = `trashure_cart_${currentUser.id}`
    localStorage.setItem(cartKey, JSON.stringify(updatedItems))
  }

  const handleClearCart = () => {
    if (!currentUser) return

    setItems([])
    const cartKey = `trashure_cart_${currentUser.id}`
    localStorage.removeItem(cartKey)
  }

  if (!isClient || isLoading) {
    return <Loading />
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Please log in</h2>
          <p className="mt-2 text-gray-500">You need to be logged in to view your cart.</p>
          <Button asChild className="mt-6">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalCost = items.reduce((acc, item) => acc + item.price, 0)
  const userCredits = currentUser?.trustScore ?? 0 // Using trustScore as credits for now
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
        type: "spring" as const,
        stiffness: 100,
      },
    },
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Cart Items ({items.length})</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
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
                        <p className="text-sm text-gray-500 mt-1">Seller: {item.seller}</p>
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
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Your Balance:</span> {userCredits} Credits
                  </p>
                </div>
                {!hasSufficientCredits && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Insufficient Credits</p>
                      <p className="text-sm">
                        You need {creditsNeeded} more credits to complete this purchase.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-4">
                {hasSufficientCredits ? (
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => router.push('/checkout')}
                  >
                    Complete Exchange
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => router.push("/purchase-credits")}
                  >
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
