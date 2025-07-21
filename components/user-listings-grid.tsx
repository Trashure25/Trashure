"use client"

import { useEffect, useState } from "react"
import { listingsService, type Listing } from "@/lib/listings"
import { ItemCard } from "@/components/item-card"
import { Loader2 } from "lucide-react"

export function UserListingsGrid() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const allListings = await listingsService.getAllListings()
        // Sort by most recent first
        const sortedListings = allListings.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        setListings(sortedListings)
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No items have been listed yet. Be the first!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {listings.map((listing) => (
        <ItemCard
          key={listing.id}
          item={{
            id: listing.id,
            name: listing.title,
            price: listing.price,
            imageUrl: listing.images[0] || "/placeholder.svg",
            designer: listing.brand || "Unbranded",
            size: listing.size || "One Size",
          }}
        />
      ))}
    </div>
  )
}
