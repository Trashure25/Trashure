import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { favoritesService } from "@/lib/favorites"
import { toast } from "@/hooks/use-toast"

interface ItemCardProps {
  item: {
    id: string
    name: string
    price: number
    imageUrl: string
    designer: string
    size: string
    userId: string
    isNew?: boolean
  }
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { currentUser } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)


  useEffect(() => {
    if (currentUser) {
      const checkFavoriteStatus = async () => {
        try {
          const favorited = await favoritesService.checkIfFavorited(currentUser.id, item.id)
          const favId = await favoritesService.getFavoriteId(currentUser.id, item.id)
          setIsFavorited(favorited)
          setFavoriteId(favId)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
      checkFavoriteStatus()
    }
  }, [currentUser, item.id])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to favorite items.",
        variant: "destructive",
      })
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
          listingId: item.id,
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



  return (
    <Link
      href={`/listing/${item.id}`}
      className="card group relative flex flex-col items-stretch p-0 overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.025] hover:shadow-2xl focus-within:scale-[1.025] focus-within:shadow-2xl cursor-pointer"
      tabIndex={0}
      aria-label={item.name}
    >
      <div className="relative w-full aspect-square bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105 group-focus:scale-105 rounded-t-2xl"
          loading="lazy"
        />
        {item.isNew && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">New</span>
        )}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm"
          onClick={handleToggleFavorite}
          disabled={isFavoriteLoading}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
        </Button>

      </div>
      <div className="flex flex-col gap-1 p-4 bg-white rounded-b-2xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-bold text-gray-900">{item.price} Credits</span>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.size}</span>
        </div>
        <div className="text-base font-semibold text-gray-900 truncate" title={item.name}>{item.name}</div>
        <div className="text-sm text-gray-500 truncate" title={item.designer}>{item.designer}</div>
      </div>
    </Link>
  )
}
