"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { listingsService, type Listing } from "@/lib/listings"
import Image from "next/image"
import { Label } from "@/components/ui/label"

export default function PurchasePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useAuth()
  
  const listingId = searchParams.get('listing')
  
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (!listingId) {
      toast({
        title: "Invalid Request",
        description: "Missing listing information.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const loadListing = async () => {
      try {
        setLoading(true)
        const listingData = await listingsService.getListingById(listingId)
        setListing(listingData)
      } catch (error) {
        console.error('Error loading listing:', error)
        toast({
          title: "Error",
          description: "Failed to load listing.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    loadListing()
  }, [currentUser, listingId, router, toast])

  const handlePurchase = async () => {
    if (!currentUser || !listing) return

    if (currentUser.credits < listing.price) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${listing.price - currentUser.credits} more credits to purchase this item.`,
        variant: "destructive",
      })
      return
    }

    setPurchasing(true)
    try {
      const response = await fetch(`/api/listings/${listing.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to purchase item')
      }

      setPurchased(true)
      toast({
        title: "Purchase Successful!",
        description: "Item has been purchased with credits.",
      })
    } catch (error) {
      console.error('Error purchasing item:', error)
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <Button onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  if (purchased) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-6">
                You have successfully purchased "{listing.title}" for {listing.price} credits.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/my-listings")} className="w-full">
                  View My Purchases
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwner = currentUser?.id === listing.userId
  const hasEnoughCredits = currentUser && currentUser.credits >= listing.price

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Purchase with Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Listing Details */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Item to Purchase:</Label>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{listing.title}</h3>
                  <p className="text-gray-600">{listing.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-500">Condition: {listing.condition}</span>
                    {listing.brand && <span className="text-gray-500">Brand: {listing.brand}</span>}
                    {listing.size && <span className="text-gray-500">Size: {listing.size}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Credits */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Purchase Details:</Label>
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Item Price:</span>
                  <span className="font-medium">{listing.price} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Credits:</span>
                  <span className="font-medium">{currentUser?.credits || 0} Credits</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Remaining Credits:</span>
                    <span className={`font-medium ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
                      {(currentUser?.credits || 0) - listing.price} Credits
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {isOwner && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  You cannot purchase your own listing.
                </p>
              </div>
            )}

            {!hasEnoughCredits && !isOwner && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  You need {listing.price - (currentUser?.credits || 0)} more credits to purchase this item.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push("/purchase-credits")}
                >
                  Purchase More Credits
                </Button>
              </div>
            )}

            {/* Purchase Button */}
            <Button 
              onClick={handlePurchase} 
              className="w-full" 
              size="lg"
              disabled={purchasing || isOwner || !hasEnoughCredits}
            >
              {purchasing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {purchasing ? "Processing Purchase..." : `Purchase for ${listing.price} Credits`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}