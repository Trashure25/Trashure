"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { favoritesService } from "@/lib/favorites"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Loader2, Heart, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { Favorite } from "@/lib/favorites"

export default function FavoritesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)
        const userFavorites = await favoritesService.getUserFavorites(currentUser.id)
        setFavorites(userFavorites || [])
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
        setError('Failed to load favorites')
        setFavorites([])
        toast({
          title: "Error",
          description: "Failed to load your favorites. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [currentUser, router, toast])

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened. Please try again.</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await favoritesService.removeFavorite(favoriteId)
      setFavorites(favorites.filter(fav => fav.id !== favoriteId))
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      })
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Favorites</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-1">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing and save items you love to your favorites.
            </p>
            <Button onClick={() => router.push("/")}>
              Start Browsing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="relative group">
              <ItemCard
                item={{
                  id: favorite.listing?.id || '',
                  name: favorite.listing?.title || '',
                  price: favorite.listing?.price || 0,
                  imageUrl: favorite.listing?.images?.[0] || '/placeholder.svg',
                  designer: favorite.listing?.brand || '',
                  size: favorite.listing?.size || '',
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveFavorite(favorite.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 