"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Listing } from "@/lib/listings"
import { listingsService } from "@/lib/listings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, Heart, Share2, Loader2, Calendar, Package } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import TradeOfferModal from "@/components/trade-offer-modal"
import ContactSellerModal from "@/components/contact-seller-modal"
import Image from "next/image"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useAuth()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [userListings, setUserListings] = useState<Listing[]>([])

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const listingData = await listingsService.getListingById(params.id as string)
        if (!listingData) {
          toast({
            title: "Listing not found",
            description: "The listing you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/")
          return
        }
        setListing(listingData)
      } catch (error) {
        console.error("Failed to fetch listing", error)
        toast({
          title: "Error",
          description: "Could not load listing details.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchListing()
    }
  }, [params.id, router, toast])

  useEffect(() => {
    if (currentUser) {
      const fetchUserListings = async () => {
        const listings = await listingsService.getListingsByUserId(currentUser.id)
        setUserListings(listings.filter((l) => l.status === "active" && l.id !== listing?.id))
      }
      fetchUserListings()
    }
  }, [currentUser, listing?.id])

  const handleAuthCheck = (callback: () => void) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    callback()
  }

  const handleContactSeller = () => {
    handleAuthCheck(() => setIsContactModalOpen(true))
  }

  const handleMakeOffer = () => {
    handleAuthCheck(() => setIsTradeModalOpen(true))
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
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "sold":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOwner = currentUser?.id === listing.userId

  return (
    <>
      <TradeOfferModal
        isOpen={isTradeModalOpen}
        onOpenChange={setIsTradeModalOpen}
        userListings={userListings}
        targetListing={listing}
      />
      <ContactSellerModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        sellerName={listing.seller || "the seller"}
      />

      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={listing.images[0] || "/placeholder.svg?height=400&width=300"}
                alt={listing.title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=100&width=100"}
                      alt={`${listing.title} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">{listing.price} Credits</span>
                <Badge variant="outline">{listing.category}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {listing.brand && (
                <div>
                  <h3 className="font-medium text-gray-900">Brand</h3>
                  <p className="text-gray-600">{listing.brand}</p>
                </div>
              )}
              {listing.size && (
                <div>
                  <h3 className="font-medium text-gray-900">Size</h3>
                  <p className="text-gray-600">{listing.size}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">Condition</h3>
                <p className="text-gray-600">{listing.condition}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Category</h3>
                <p className="text-gray-600">{listing.category}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>

            {!isOwner && (
              <div className="space-y-3">
                <Button onClick={handleMakeOffer} className="w-full" size="lg">
                  <Package className="w-4 h-4 mr-2" />
                  Make Trade Offer
                </Button>
                <Button onClick={handleContactSeller} variant="outline" className="w-full bg-transparent" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            )}

            {isOwner && (
              <div className="space-y-3">
                <Button onClick={() => router.push(`/edit-listing/${listing.id}`)} className="w-full" size="lg">
                  Edit Listing
                </Button>
                <p className="text-sm text-gray-500 text-center">This is your listing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
