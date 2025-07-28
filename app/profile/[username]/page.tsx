"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { messagesService } from "@/lib/messages"
import { listingsService } from "@/lib/listings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, Star, Package, Calendar, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import type { Listing } from "@/lib/listings"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  avatarUrl?: string
  trustScore: number
  createdAt: string
  updatedAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const username = params.username as string
        
        // Fetch user profile
        const response = await fetch(`/api/users/profile/${username}`)
        if (!response.ok) {
          throw new Error('User not found')
        }
        
        const userData = await response.json()
        setUserProfile(userData)
        
        // Fetch user's listings
        const listingsResponse = await fetch(`/api/listings?userId=${userData.id}`)
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setUserListings(listingsData.listings || listingsData)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.username) {
      fetchUserProfile()
    }
  }, [params.username, toast])

  const handleContactUser = async () => {
    if (!currentUser || !userProfile) {
      toast({
        title: "Please log in",
        description: "You must be logged in to message users.",
        variant: "destructive",
      })
      return
    }

    if (currentUser.id === userProfile.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot send messages to your own profile.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if conversation already exists
      const conversations = await messagesService.getConversations(currentUser.id)
      const existingConversation = conversations.find(conv => 
        (conv.user1Id === userProfile.id || conv.user2Id === userProfile.id)
      )
      
      if (existingConversation) {
        // Navigate to existing conversation
        router.push(`/messages?conversation=${existingConversation.id}`)
      } else {
        // Create new conversation
        const conversation = await messagesService.createConversation({
          otherUserId: userProfile.id,
          initialMessage: `Hi! I'd like to chat with you about your listings.`
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
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
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

  if (!userProfile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userProfile.id

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile.avatarUrl || undefined} alt="User avatar" />
              <AvatarFallback className="text-2xl">
                {userProfile.firstName[0]}{userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <p className="text-gray-600">@{userProfile.username}</p>
                </div>
                
                {!isOwnProfile && (
                  <Button onClick={handleContactUser} className="ml-auto">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Trust Score:</span>
                  <Badge className={getTrustScoreBadge(userProfile.trustScore)}>
                    {userProfile.trustScore}/100
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {userListings.length} listings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'listings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('listings')}
        >
          <Package className="w-4 h-4 mr-2" />
          Listings ({userListings.length})
        </Button>
        <Button
          variant={activeTab === 'reviews' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reviews')}
        >
          <Star className="w-4 h-4 mr-2" />
          Reviews (Coming Soon)
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'listings' && (
        <div>
          {userListings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "You haven't created any listings yet." 
                    : "This user hasn't created any listings yet."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={listing.images[0] || "/placeholder.svg"}
                        alt={listing.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {listing.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {listing.price} Credits
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {listing.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reviews Coming Soon</h3>
            <p className="text-gray-600">
              User reviews and ratings will be available soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 