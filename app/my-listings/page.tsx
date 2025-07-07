"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/auth"
import type { User } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Package, Eye, Edit, Trash2 } from "lucide-react"

// Mock listing data - in a real app this would come from your database
interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  status: "active" | "sold" | "draft"
  images: string[]
  createdAt: string
}

export default function MyListingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [listings] = useState<Listing[]>([
    {
      id: "1",
      title: "Vintage Levi's 501 Jeans",
      description: "Classic vintage Levi's in excellent condition",
      price: 45,
      category: "Denim",
      status: "active",
      images: ["/placeholder.svg?height=200&width=200"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Supreme Box Logo Hoodie",
      description: "Authentic Supreme hoodie, size M",
      price: 120,
      category: "Streetwear",
      status: "sold",
      images: ["/placeholder.svg?height=200&width=200"],
      createdAt: "2024-01-10",
    },
  ])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        if (!currentUser) {
          router.push("/")
        } else {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(listing.status)}`}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{listing.price} Credits</span>
                  <Badge variant="outline">{listing.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
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
