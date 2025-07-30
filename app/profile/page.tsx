"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { listingsService } from "@/lib/listings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  Calendar, 
  Shield, 
  Loader2,
  Edit,
  Star,
  MessageCircle,
  CreditCard,
  LogOut
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Listing } from "@/lib/listings"

interface UserStats {
  totalListings: number
  activeListings: number
  soldListings: number
  totalFavorites: number
  memberSince: string
}

export default function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'favorites' | 'settings'>('overview')

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Fetch user's listings
        const listingsResponse = await fetch(`/api/listings?userId=${currentUser.id}`)
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setUserListings(listingsData.listings || listingsData)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser, router, toast])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
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

  const userStats: UserStats = {
    totalListings: userListings.length,
    activeListings: userListings.filter(l => l.status === 'active').length,
    soldListings: userListings.filter(l => l.status === 'sold').length,
    totalFavorites: 0, // TODO: Implement favorites count
    memberSince: currentUser ? new Date(currentUser.createdAt).toLocaleDateString() : ''
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and view your activity</p>
        </div>
        <div className="flex gap-2">
          <Link href="/account-settings">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={currentUser.avatarUrl || undefined} alt="Profile avatar" />
                  <AvatarFallback className="text-2xl">
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <p className="text-gray-600">@{currentUser.username}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Trust Score:</span>
                  <Badge className={getTrustScoreBadge(currentUser.trustScore)}>
                    {currentUser.trustScore}/100
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Credits:</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    {currentUser.credits || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {userStats.memberSince}</span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{userStats.totalListings}</div>
                    <div className="text-sm text-gray-600">Listings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{userStats.activeListings}</div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/list-item">
                    <Button className="w-full">
                      <Package className="w-4 h-4 mr-2" />
                      Create New Listing
                    </Button>
                  </Link>
                  <Link href="/purchase-credits">
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Purchase Credits
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                My Listings
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Active Listings</p>
                          <p className="text-sm text-gray-600">{userStats.activeListings} items for sale</p>
                        </div>
                      </div>
                      <Link href="/my-listings">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium">Favorites</p>
                          <p className="text-sm text-gray-600">{userStats.totalFavorites} saved items</p>
                        </div>
                      </div>
                      <Link href="/favorites">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-gray-600">View your conversations</p>
                        </div>
                      </div>
                      <Link href="/messages">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Credits Balance</p>
                          <p className="text-sm text-green-600">{currentUser.credits || 0} credits available</p>
                        </div>
                      </div>
                      <Link href="/purchase-credits">
                        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                          Buy More
                        </Button>
                      </Link>
                    </div>

                    {currentUser.role === 'admin' && (
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-800">Admin Dashboard</p>
                            <p className="text-sm text-red-600">Manage users, reports, and platform</p>
                          </div>
                        </div>
                        <Link href="/admin">
                          <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                            Access
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Trust Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Score</span>
                      <span className={`font-semibold ${getTrustScoreColor(currentUser.trustScore)}`}>
                        {currentUser.trustScore}/100
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentUser.trustScore >= 80 ? 'bg-green-500' :
                          currentUser.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${currentUser.trustScore}%` }}
                      ></div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {currentUser.trustScore >= 80 ? (
                        <p>Excellent! Your high trust score shows you're a reliable community member.</p>
                      ) : currentUser.trustScore >= 60 ? (
                        <p>Good standing. Continue making successful trades to improve your score.</p>
                      ) : (
                        <p>Your trust score needs improvement. Focus on successful trades and positive interactions.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">My Listings</h3>
                <Link href="/list-item">
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Create New Listing
                  </Button>
                </Link>
              </div>

              {userListings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start selling by creating your first listing.
                    </p>
                    <Link href="/list-item">
                      <Button>
                        <Package className="w-4 h-4 mr-2" />
                        Create Your First Listing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userListings.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-lg transition-shadow">
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
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {listing.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {listing.price} Credits
                          </span>
                          <Link href={`/edit-listing/${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">My Favorites</h3>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start browsing and save items you love to your favorites.
                  </p>
                  <Link href="/">
                    <Button>
                      Start Browsing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href="/account-settings">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile Information
                      </Button>
                    </Link>
                    
                    <Link href="/purchase-credits">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Purchase Credits
                      </Button>
                    </Link>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Manual Credits (if you don't like AI evaluation)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="Enter credits"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                          value={currentUser.manualCredits || 0}
                          onChange={async (e) => {
                            const value = parseInt(e.target.value) || 0
                            try {
                              const response = await fetch('/api/users/manual-credits', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ manualCredits: value })
                              })
                              if (response.ok) {
                                toast({
                                  title: "Manual credits updated",
                                  description: "Your manual credits have been updated.",
                                })
                              }
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to update manual credits.",
                                variant: "destructive",
                              })
                            }
                          }}
                        />
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Current manual credits: {currentUser.manualCredits || 0}
                      </p>
                    </div>

                    <Link href="/messages">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        My Messages
                      </Button>
                    </Link>

                    <Link href="/favorites">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-2" />
                        My Favorites
                      </Button>
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}

                    <Separator />

                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 