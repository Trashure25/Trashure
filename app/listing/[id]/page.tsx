"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Listing } from "@/lib/listings"
import { listingsService } from "@/lib/listings"
import { messagesService } from "@/lib/messages"
import { reportsService } from "@/lib/reports"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, Heart, Share2, Loader2, Calendar, Package, Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import TradeOfferModal from "@/components/trade-offer-modal"
import ContactSellerModal from "@/components/contact-seller-modal"
import ReportUserModal from "@/components/report-user-modal"
import Image from "next/image"
import { favoritesService } from "@/lib/favorites"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [hasReportedSeller, setHasReportedSeller] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        console.log('Fetching listing with ID:', params.id)
        
        const listingData = await listingsService.getListingById(params.id as string)
        if (!listingData) {
          console.log('Listing not found, showing fallback data')
          
          // Show fallback data for demo purposes when database is unavailable
          const fallbackListing = {
            id: params.id as string,
            userId: 'demo-user',
            title: 'Louis Vuitton SS25 T-shirt',
            description: 'Exclusive Louis Vuitton Spring/Summer 2025 collection t-shirt. Made from premium cotton with the iconic LV monogram. Perfect condition with tags.',
            category: 'Menswear - Tops',
            condition: 'New with tags',
            price: 8925,
            brand: 'Louis Vuitton',
            size: 'MEDIUM',
            images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              firstName: 'Demo',
              lastName: 'User',
              username: 'demouser',
              trustScore: 75,
              avatarUrl: undefined
            }
          }
          
          setListing(fallbackListing)
          return
        }
        setListing(listingData)
      } catch (error) {
        console.error("Failed to fetch listing", error)
        
        // Show fallback data for demo purposes when database is unavailable
        const fallbackListing = {
          id: params.id as string,
          userId: 'demo-user',
          title: 'Louis Vuitton SS25 T-shirt',
          description: 'Exclusive Louis Vuitton Spring/Summer 2025 collection t-shirt. Made from premium cotton with the iconic LV monogram. Perfect condition with tags.',
          category: 'Menswear - Tops',
          condition: 'New with tags',
          price: 8925,
          brand: 'Louis Vuitton',
          size: 'MEDIUM',
          images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
          status: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            firstName: 'Demo',
            lastName: 'User',
            username: 'demouser',
            trustScore: 75,
            avatarUrl: undefined
          }
        }
        
        setListing(fallbackListing)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchListing()
    }
  }, [params.id, router, toast])

  useEffect(() => {
    if (currentUser && listing) {
      const checkFavoriteStatus = async () => {
        try {
          const favorited = await favoritesService.checkIfFavorited(currentUser.id, listing.id)
          const favId = await favoritesService.getFavoriteId(currentUser.id, listing.id)
          setIsFavorited(favorited)
          setFavoriteId(favId)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
      checkFavoriteStatus()

      // Check if user has reported the seller
      if (listing.user && currentUser.id !== listing.userId) {
        const checkReportStatus = async () => {
          try {
            const hasReported = await reportsService.checkIfReported(currentUser.id, listing.userId)
            setHasReportedSeller(hasReported)
          } catch (error) {
            console.error('Error checking report status:', error)
          }
        }
        checkReportStatus()
      }
    }
  }, [currentUser, listing])

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to favorite items.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsFavoriteLoading(true)
    try {
      if (isFavorited && favoriteId) {
        await favoritesService.removeFavorite(favoriteId)
        setIsFavorited(false)
        setFavoriteId(null)
        toast({
          title: "Removed from favorites",
          description: "Item has been removed from your favorites.",
        })
      } else {
        const newFavorite = await favoritesService.addFavorite({
          userId: currentUser.id,
          listingId: listing.id,
        })
        setIsFavorited(true)
        setFavoriteId(newFavorite.id)
        toast({
          title: "Added to favorites",
          description: "Item has been added to your favorites.",
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this item: ${listing.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Listing link has been copied to your clipboard.",
        })
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast({
          title: "Error",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  useEffect(() => {
    if (currentUser) {
      const fetchUserListings = async () => {
        const listings = await listingsService.getListingsForUser(currentUser.id)
        setUserListings(listings.filter((l: any) => l.status === "active" && l.id !== listing?.id))
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

  const handleContactSeller = async () => {
    handleAuthCheck(async () => {
      if (!currentUser || !listing) return
      
      try {
        // Check if conversation already exists
        const conversations = await messagesService.getConversations(currentUser.id)
        const existingConversation = conversations.find(conv => 
          conv.listingId === listing.id && 
          (conv.user1Id === listing.userId || conv.user2Id === listing.userId)
        )
        
        if (existingConversation) {
          // Navigate to existing conversation
          router.push(`/messages?conversation=${existingConversation.id}`)
        } else {
          // Create new conversation
          const conversation = await messagesService.createConversation({
            otherUserId: listing.userId,
            listingId: listing.id,
            initialMessage: `Hi! I'm interested in your ${listing.title}. Is it still available?`
          })
          
          // Navigate to new conversation
          router.push(`/messages?conversation=${conversation.id}`)
        }
      } catch (error) {
        console.error('Failed to create conversation:', error)
        toast({
          title: "Error",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive",
        })
      }
    })
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
        sellerName={listing.user ? `${listing.user.firstName} ${listing.user.lastName}` : "the seller"}
      />

      {/* Report User Modal */}
      {listing?.user && currentUser && (
        <ReportUserModal
          isOpen={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
          reportedUserId={listing.userId}
          reportedUserName={`${listing.user.firstName} ${listing.user.lastName}`}
        />
      )}

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
                src={listing.images[currentImageIndex] || "/placeholder.svg"}
                alt={listing.title}
                width={400}
                height={400}
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
                      currentImageIndex === index ? "border-accent" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
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
                  <Button variant="outline" size="sm" onClick={handleToggleFavorite} disabled={isFavoriteLoading}>
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} disabled={isFavoriteLoading}>
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

            {/* Seller Info */}
            {listing.user && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Seller</h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={listing.user.avatarUrl || undefined} alt="Seller avatar" />
                      <AvatarFallback>
                        {listing.user.firstName[0]}{listing.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {listing.user.firstName} {listing.user.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Trust Score: {listing.user.trustScore || 0}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">@{listing.user.username}</p>
                    </div>
                    <Link href={`/profile/${listing.user.username}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    
                    {!isOwner && currentUser && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsReportModalOpen(true)}
                        disabled={hasReportedSeller}
                        className={hasReportedSeller ? "opacity-50" : ""}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {hasReportedSeller ? "Reported" : "Report"}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

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
                {listing.user && (
                  <Link href={`/profile/${listing.user.username}`}>
                    <Button variant="ghost" className="w-full" size="lg">
                      <Shield className="w-4 h-4 mr-2" />
                      View Seller Profile
                    </Button>
                  </Link>
                )}
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
