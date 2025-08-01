"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
import { AdvancedSearch } from "@/components/advanced-search"
import { Search, Loader2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Listing {
  id: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  brand?: string
  size?: string
  images: string[]
  createdAt: string
  user: {
    id: string
    username: string
    trustScore: number
    location?: string
  }
  style?: string
  color?: string
  material?: string
  season?: string
  era?: string
  releaseYear?: number
  collaboration?: string
  exclusivity?: string
  department?: string
  location?: string
  designer?: string
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Build search URL with all parameters
  const buildSearchUrl = () => {
    const params = new URLSearchParams()
    
    if (query) params.set('q', query)
    if (page > 1) params.set('page', page.toString())
    
    // Add all filter parameters
    searchParams.forEach((value, key) => {
      if (key !== 'q' && key !== 'page') {
        params.set(key, value)
      }
    })
    
    return `/api/search?${params.toString()}`
  }

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const url = buildSearchUrl()
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setListings(data.listings || [])
        setTotal(data.total || 0)
        setHasMore(data.hasMore || false)
        
        // Extract active filters for display
        const filters: string[] = []
        searchParams.forEach((value, key) => {
          if (key !== 'q' && key !== 'page' && value) {
            filters.push(`${key}: ${value}`)
          }
        })
        setActiveFilters(filters)
        
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchParams, page])

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  if (loading && page === 1) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search Results</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Advanced Search Component */}
      <div className="mb-8">
        <AdvancedSearch />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        </div>
        
        {query && (
          <p className="text-gray-600 mb-2">
            Showing results for "<span className="font-medium">{query}</span>"
          </p>
        )}
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {filter}
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-sm text-gray-600">
          Found {total} result{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            {query ? `No items found for "${query}". Try adjusting your search terms or filters.` : 'No items available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {listings.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.title,
                      price: item.price,
                      imageUrl: item.images[0] || "/placeholder.jpg",
                      designer: item.brand || item.designer || "Unknown Brand",
                      size: item.size || "One Size",
                      userId: item.user.id,
                      isNew: new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }}
                  />
                ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
} 