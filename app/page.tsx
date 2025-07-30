"use client"

import { useEffect, useState } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ItemCard } from "@/components/item-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Listing } from "@/lib/listings"

export default function HomePage() {
  const [trendingItems, setTrendingItems] = useState<Listing[]>([])
  const [luxuryItems, setLuxuryItems] = useState<Listing[]>([])
  const [vintageItems, setVintageItems] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  // Luxury designer brands
  const LUXURY_BRANDS = [
    'Louis Vuitton', 'Dior', 'Gucci', 'Prada', 'Saint Laurent', 'Balenciaga', 
    'Chanel', 'Miu Miu', 'Fendi', 'Celine', 'Bottega Veneta', 'Hermès',
    'Givenchy', 'Valentino', 'Versace', 'Dolce & Gabbana', 'Balenciaga',
    'Alexander McQueen', 'Stella McCartney', 'Chloé', 'Loewe', 'Balmain'
  ]

  // Vintage and archive keywords
  const VINTAGE_KEYWORDS = [
    'vintage', 'archive', 'retro', 'classic', 'heritage', 'legacy',
    '90s', '80s', '70s', '60s', '50s', '40s', '30s', '20s',
    'y2k', 'millennium', 'pre-2000', 'old school', 'throwback'
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/listings?limit=100&sortBy=createdAt&sortOrder=desc')
        if (!response.ok) throw new Error('Failed to fetch listings')
        
        const data = await response.json()
        const allListings = data.listings || data

        // Get trending items (most recent)
        const trending = allListings.slice(0, 4)
        setTrendingItems(trending)

        // Get luxury items
        const luxury = allListings.filter((listing: Listing) => 
          listing.brand && LUXURY_BRANDS.some(brand => 
            listing.brand!.toLowerCase().includes(brand.toLowerCase())
          )
        ).slice(0, 4)
        setLuxuryItems(luxury)

        // Get vintage items
        const vintage = allListings.filter((listing: Listing) => {
          const searchText = `${listing.title} ${listing.description} ${listing.brand || ''}`.toLowerCase()
          return VINTAGE_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()))
        }).slice(0, 4)
        setVintageItems(vintage)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f5f5f5] to-[#e5e5e5] flex flex-col items-center justify-start pt-0 pb-12">
      {/* Hero Carousel */}
      <section className="w-full max-w-5xl mx-auto mb-16 animate-fade-in mt-8">
        <HeroCarousel />
      </section>

      {/* Featured Sections */}
      <section className="w-full max-w-6xl mx-auto mb-10 px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trending Items */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Most viewed and popular items</div>
            <div className="text-lg font-bold mb-2 text-black">Trending Items</div>
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 animate-pulse" />
                ))
              ) : trendingItems.length > 0 ? (
                trendingItems.map((item, idx) => (
                  <div key={item.id} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      src={item.images[0] || "/placeholder.jpg"} 
                      alt={item.title} 
                      className="object-cover w-full h-full" 
                    />
                    {idx === 3 && (
                      <Link href="/trending">
                        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-black/70 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                // Empty state
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
                    {i === 3 && (
                      <Link href="/trending">
                        <span className="text-gray-400 text-xs font-mono uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Luxury Sector */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Louis Vuitton, Dior, Gucci, Prada, Saint Laurent, Balenciaga, Chanel, Miu Miu, Fendi, Celine, Bottega Veneta, Hermès, Givenchy, Valentino, Versace, Dolce & Gabbana, Alexander McQueen, Stella McCartney, Chloé, Loewe, Balmain +more</div>
            <div className="text-lg font-bold mb-2 text-black">Luxury Sector</div>
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 animate-pulse" />
                ))
              ) : luxuryItems.length > 0 ? (
                luxuryItems.map((item, idx) => (
                  <div key={item.id} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      src={item.images[0] || "/placeholder.jpg"} 
                      alt={item.title} 
                      className="object-cover w-full h-full" 
                    />
                    {idx === 3 && (
                      <Link href="/luxury">
                        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-black/70 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                // Empty state
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
                    {i === 3 && (
                      <Link href="/luxury">
                        <span className="text-gray-400 text-xs font-mono uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vintage & Archive */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Vintage, Archive, Retro, Classic, Heritage, Legacy, 90s, 80s, 70s, 60s, 50s, 40s, 30s, 20s, Y2K, Millennium, Pre-2000, Old School, Throwback +more</div>
            <div className="text-lg font-bold mb-2 text-black">Vintage & Archive</div>
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 animate-pulse" />
                ))
              ) : vintageItems.length > 0 ? (
                vintageItems.map((item, idx) => (
                  <div key={item.id} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      src={item.images[0] || "/placeholder.jpg"} 
                      alt={item.title} 
                      className="object-cover w-full h-full" 
                    />
                    {idx === 3 && (
                      <Link href="/vintage">
                        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-black/70 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                // Empty state
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
                    {i === 3 && (
                      <Link href="/vintage">
                        <span className="text-gray-400 text-xs font-mono uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors">
                          + View More
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
