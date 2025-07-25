"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Listing } from "@/lib/listings"
import { listingsService } from "@/lib/listings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Package, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function MyListingsPage() {
  const router = useRouter()
  const { currentUser, isLoading: authLoading } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to view your listings.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (currentUser) {
      console.log('Current user object:', currentUser)
      console.log('Current user ID:', currentUser.id)
      const fetchListings = async () => {
        try {
          setLoadingListings(true)
          console.log('Fetching listings for user ID:', currentUser.id)
          const userListings = await listingsService.getListingsForUser(currentUser.id)
          console.log('User listings response:', userListings)
          setListings(userListings)
        } catch (error) {
          console.error("Failed to fetch listings", error)
          toast({
            title: "Error",
            description: "Could not fetch your listings.",
            variant: "destructive",
          })
        } finally {
          setLoadingListings(false)
        }
      }
      fetchListings()
    }
  }, [currentUser, authLoading, router])

  const handleDeleteListing = async (listingId: string) => {
    try {
      await listingsService.deleteListing(listingId)
      setListings((prev) => prev.filter((listing) => listing.id !== listingId))
      toast({
        title: "Success",
        description: "Listing deleted successfully.",
        className: "bg-green-100 text-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete listing.",
        variant: "destructive",
      })
    }
  }

  const handleViewListing = (listingId: string) => {
    router.push(`/listing/${listingId}`)
  }

  const handleEditListing = (listingId: string) => {
    router.push(`/edit-listing/${listingId}`)
  }

  if (authLoading || loadingListings) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentUser) {
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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage your items for trade</p>
        </div>
        <Link href="/list-item">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            List New Item
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Start by listing your first item for trade</p>
            
            {/* Temporary debug section */}
            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Current User ID: {currentUser?.id}</p>
              <p>Listings found: {listings.length}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    const allListings = await listingsService.getAllListings()
                    console.log('All listings in database:', allListings)
                    alert(`Found ${allListings.length} total listings. Check console for details.`)
                  } catch (error) {
                    console.error('Error fetching all listings:', error)
                    alert('Error fetching all listings. Check console.')
                  }
                }}
                className="mt-2"
              >
                Debug: Show All Listings
              </Button>
            </div>
            
            <Link href="/list-item">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                List Your First Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={listing.images?.[0] || "/placeholder.svg?height=300&width=300"}
                  alt={listing.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(listing.status)}`}>
                  {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1) || 'Active'}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg truncate">{listing.title}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{listing.price} Credits</span>
                  <Badge variant="outline">{listing.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{listing.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewListing(listing.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditListing(listing.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteListing(listing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
