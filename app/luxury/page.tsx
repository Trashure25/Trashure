"use client"

import { useEffect, useState } from "react"
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
import type { Listing } from "@/lib/listings"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Luxury designer brands
const LUXURY_BRANDS = [
  'Louis Vuitton', 'Dior', 'Gucci', 'Prada', 'Saint Laurent', 'Balenciaga', 
  'Chanel', 'Miu Miu', 'Fendi', 'Celine', 'Bottega Veneta', 'Hermès',
  'Givenchy', 'Valentino', 'Versace', 'Dolce & Gabbana', 'Balenciaga',
  'Alexander McQueen', 'Stella McCartney', 'Chloé', 'Loewe', 'Balmain'
]

export default function LuxuryPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    brand: [] as string[],
    condition: [] as string[],
    size: [] as string[],
  })

  // Fetch luxury listings
  useEffect(() => {
    const fetchListings = async (retryCount = 0) => {
      try {
        console.log('Fetching luxury listings...')
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        // Fetch all listings and filter for luxury brands
        const response = await fetch('/api/listings?limit=200', {
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const allListings = data.listings || data
        
        // Filter for luxury brands
        const luxuryListings = allListings.filter((listing: Listing) => 
          listing.brand && LUXURY_BRANDS.some(brand => 
            listing.brand.toLowerCase().includes(brand.toLowerCase())
          )
        )
        
        console.log('Fetched luxury listings:', luxuryListings.length)
        
        setListings(luxuryListings)
        setFilteredListings(luxuryListings)
        
      } catch (error) {
        console.error('Error fetching luxury listings:', error)
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}`)
          setTimeout(() => fetchListings(retryCount + 1), 1000 * (retryCount + 1))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...listings]

    // Apply brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(item => item.brand && filters.brand.includes(item.brand))
    }

    // Apply condition filter
    if (filters.condition.length > 0) {
      filtered = filtered.filter(item => filters.condition.includes(item.condition))
    }

    // Apply size filter
    if (filters.size.length > 0) {
      filtered = filtered.filter(item => item.size && filters.size.includes(item.size))
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredListings(filtered)
  }, [listings, filters, sortBy])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev].includes(value)
        ? prev[filterType as keyof typeof prev].filter(item => item !== value)
        : [...prev[filterType as keyof typeof prev], value]
    }))
  }

  // Get unique brands from current listings
  const availableBrands = [...new Set(listings.map(item => item.brand).filter(Boolean))].sort()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading luxury items...</p>
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
            <BreadcrumbPage>Luxury Sector</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Luxury Sector</h1>
        <p className="text-gray-600">Discover premium designer items from the world's most prestigious brands</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Brand Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Designer Brand</label>
                <AdvancedAutocomplete
                  options={availableBrands}
                  placeholder="Search designers..."
                  onSelect={(brand) => handleFilterChange('brand', brand)}
                />
                <div className="mt-2 space-y-1">
                  {filters.brand.map(brand => (
                    <div key={brand} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                      <span>{brand}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange('brand', brand)}
                        className="h-4 w-4 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Condition Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <div className="space-y-2">
                  {['New', 'Like New', 'Good', 'Fair', 'Poor'].map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.condition.includes(condition)}
                        onCheckedChange={() => handleFilterChange('condition', condition)}
                      />
                      <label htmlFor={`condition-${condition}`} className="text-sm">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No luxury items found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  Showing {filteredListings.length} of {listings.length} luxury items
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.title,
                      price: item.price,
                      imageUrl: item.images[0] || "/placeholder.jpg",
                      designer: item.brand || "Unknown Brand",
                      size: item.size || "One Size",
                      userId: item.userId,
                      isNew: new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 