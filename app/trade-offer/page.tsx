"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, CreditCard, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { listingsService, type Listing } from "@/lib/listings"
import { messagesService, type Conversation } from "@/lib/messages"
import Image from "next/image"

export default function TradeOfferPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useAuth()
  
  const conversationId = searchParams.get('conversation')
  const listingId = searchParams.get('listing')
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [targetListing, setTargetListing] = useState<Listing | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [selectedListingId, setSelectedListingId] = useState<string>("")
  const [additionalCredits, setAdditionalCredits] = useState("0")

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (!conversationId || !listingId) {
      toast({
        title: "Invalid Request",
        description: "Missing conversation or listing information.",
        variant: "destructive",
      })
      router.push("/messages")
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load target listing
        const listing = await listingsService.getListingById(listingId)
        setTargetListing(listing)
        
        // Load conversation
        const conversations = await messagesService.getConversations(currentUser.id)
        const conv = conversations.find(c => c.id === conversationId)
        if (!conv) {
          throw new Error('Conversation not found')
        }
        setConversation(conv)
        
        // Load user's listings
        const userListingsData = await listingsService.getUserListings(currentUser.id)
        setUserListings(userListingsData.filter(l => l.status === 'active'))
        
      } catch (error) {
        console.error('Error loading trade offer data:', error)
        toast({
          title: "Error",
          description: "Failed to load trade offer data.",
          variant: "destructive",
        })
        router.push("/messages")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentUser, conversationId, listingId, router, toast])

  const handleSubmitOffer = async () => {
    if (!currentUser || !targetListing || !conversation) return

    const credits = parseInt(additionalCredits) || 0
    
    if (credits > currentUser.credits) {
      toast({
        title: "Insufficient Credits",
        description: `You only have ${currentUser.credits} credits available.`,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/trade-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          receiverId: conversation.otherUser.id,
          offeredListingId: selectedListingId || null,
          requestedListingId: targetListing.id,
          additionalCredits: credits,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create trade offer')
      }

      toast({
        title: "Trade Offer Sent!",
        description: "Your trade offer has been sent successfully.",
      })

      router.push(`/messages?conversation=${conversationId}`)
    } catch (error) {
      console.error('Error creating trade offer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trade offer.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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

  if (!targetListing || !conversation) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <Button onClick={() => router.push("/messages")}>
            Back to Messages
          </Button>
        </div>
      </div>
    )
  }

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
              <Package className="w-5 h-5" />
              Make Trade Offer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Listing */}
            <div className="space-y-3">
              <Label>You're offering to trade for:</Label>
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={targetListing.images[0] || "/placeholder.svg"}
                    alt={targetListing.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{targetListing.title}</h3>
                  <p className="text-sm text-gray-600">{targetListing.price} Credits</p>
                  <p className="text-xs text-gray-500">{targetListing.condition}</p>
                </div>
              </div>
            </div>

            {/* Your Listing (Optional) */}
            <div className="space-y-3">
              <Label>Your item to offer (optional):</Label>
              <Select value={selectedListingId} onValueChange={setSelectedListingId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select one of your items to offer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No item (credits only)</SelectItem>
                  {userListings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.title} ({listing.price} credits)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Credits */}
            <div className="space-y-3">
              <Label>Additional credits to offer:</Label>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  min="0"
                  max={currentUser?.credits || 0}
                  value={additionalCredits}
                  onChange={(e) => setAdditionalCredits(e.target.value)}
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">
                  / {currentUser?.credits || 0} available
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Trade Summary:</h4>
              <div className="text-sm space-y-1">
                <p>You offer: {selectedListingId ? userListings.find(l => l.id === selectedListingId)?.title : 'Nothing'} + {additionalCredits} credits</p>
                <p>You receive: {targetListing.title}</p>
                <p className="font-medium text-blue-600">
                  Total value: {(selectedListingId ? userListings.find(l => l.id === selectedListingId)?.price || 0) + parseInt(additionalCredits || '0')} credits
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmitOffer} 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Package className="w-4 h-4 mr-2" />
              )}
              {submitting ? "Sending Offer..." : "Send Trade Offer"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 