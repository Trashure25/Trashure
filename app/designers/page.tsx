"use client"

import { useEffect, useState } from "react"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryFilters } from "@/components/category-filters"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Search } from "lucide-react"
import type { Listing } from "@/lib/listings"

const designerBrands = [
  "Louis Vuitton", "Dior", "Bottega Veneta", "Gucci", "Prada", 
  "Saint Laurent", "Balenciaga", "Chanel", "Miu Miu", "Fendi", 
  "Celine", "Off-White", "Stussy", "Essentials", "Fear of God", 
  "Aime Leon Dore", "Supreme", "Palace", "A Bathing Ape", 
  "Comme des Garçons", "Vintage & Archive"
]

export default function DesignersPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    category: [] as string[],
    brand: [] as string[],
    condition: [] as string[],
    size: [] as string[],
  })
  const [sortBy, setSortBy] = useState("newest")
  const [brandOptions, setBrandOptions] = useState<string[]>([])

  // Fetch designer listings
  useEffect(() => {
    const fetchListings = async (retryCount = 0) => {
      try {
        console.log('Fetching listings from /api/listings...')
        
        // Add timeout to prevent infinite loading
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased timeout to 15 seconds
        
        const response = await fetch('/api/listings', {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        console.log('Response status:', response.status)
        
        if (response.status === 503) {
          // Database connection error
          throw new Error('Database connection failed')
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fetched data:', data)
        
        // Validate response
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        
        const designerListings = data.filter((listing: Listing) => 
          designerBrands.some(brand => listing.brand === brand)
        )
        console.log('Filtered designer listings:', designerListings)
        
        // Always set the real data, even if it's empty
        setListings(designerListings)
        setFilteredListings(designerListings)
      } catch (error) {
        console.error('Failed to fetch listings:', error)
        
        // Retry logic for connection errors
        const isConnectionError = error instanceof Error && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('AbortError') ||
          error.message.includes('timeout') ||
          error.message.includes('Can\'t reach database server') ||
          error.message.includes('Database connection failed')
        )
        
        if (isConnectionError && retryCount < 2) {
          console.log(`Connection error, retrying... (attempt ${retryCount + 1}/3)`)
          setTimeout(() => fetchListings(retryCount + 1), 2000 * (retryCount + 1))
          return
        }
        
        if (isConnectionError) {
          console.log('Database connection error detected after retries, showing fallback data')
          // Add fallback data for demo purposes when database is unavailable
          const fallbackData = [
            {
              id: 'demo-1',
              title: 'Louis Vuitton SS25 T-shirt',
              price: 8925,
              brand: 'Louis Vuitton',
              size: 'MEDIUM',
              condition: 'New with tags',
              category: 'Menswear - Tops',
              description: 'Exclusive Louis Vuitton Spring/Summer 2025 collection t-shirt',
              images: ['/placeholder.svg'],
              createdAt: new Date().toISOString(),
              status: 'active'
            },
            {
              id: 'demo-2',
              title: 'Dior Homme Classic Blazer',
              price: 12500,
              brand: 'Dior',
              size: 'LARGE',
              condition: 'Like new',
              category: 'Menswear - Formal Wear',
              description: 'Timeless Dior Homme blazer in pristine condition',
              images: ['/placeholder.svg'],
              createdAt: new Date().toISOString(),
              status: 'active'
            }
          ] as Listing[]
          
          setListings(fallbackData)
          setFilteredListings(fallbackData)
        } else {
          // For other errors, just show empty state
          console.log('Non-connection error, showing empty state')
          setListings([])
          setFilteredListings([])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  // Fetch unique brands for autocomplete
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/listings")
        const data = await res.json()
        const brands = Array.from(new Set(data.map((item: any) => String(item.brand)).filter(Boolean))) as string[];
        setBrandOptions(brands)
      } catch (e) {
        setBrandOptions([])
      }
    }
    fetchBrands()
  }, [])

  // Apply filters, sorting, and search
  useEffect(() => {
    let filtered = [...listings]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => 
        filters.category.some(cat => item.category.includes(cat))
      )
    }

    // Apply brand filters
    if (filters.brand.length > 0) {
      filtered = filtered.filter(item => 
        item.brand && filters.brand.includes(item.brand)
      )
    }

    // Apply condition filters
    if (filters.condition.length > 0) {
      filtered = filtered.filter(item => 
        filters.condition.includes(item.condition)
      )
    }

    // Apply size filters
    if (filters.size.length > 0) {
      filtered = filtered.filter(item => 
        item.size && filters.size.includes(item.size)
      )
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
    }

    setFilteredListings(filtered)
  }, [listings, filters, sortBy, searchTerm])

  const categoryOptions = [
    "T-Shirts & Tops",
    "Pants & Jeans", 
    "Outerwear",
    "Shoes & Boots",
    "Accessories",
    "Formal Wear",
    "Dresses",
    "Skirts"
  ]

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading designer items...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Designers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Filters
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setFilters({ category: [], brand: [], condition: [], size: [] })}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sort By */}
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
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Brand Filter (AdvancedAutocomplete) */}
              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <AdvancedAutocomplete
                  options={brandOptions}
                  value={filters.brand[0] || ""}
                  onChange={v => setFilters(f => ({ ...f, brand: v ? [v] : [] }))}
                  placeholder="Type or select a brand"
                  allowCustom={true}
                />
              </div>

              {/* (Optional) Designer Filter (AdvancedAutocomplete) */}
              {/*
              <div>
                <label className="text-sm font-medium mb-2 block">Designer</label>
                <AdvancedAutocomplete
                  options={designerOptions}
                  value={filters.designer[0] || ""}
                  onChange={v => setFilters(f => ({ ...f, designer: v ? [v] : [] }))}
                  placeholder="Type or select a designer"
                  allowCustom={true}
                />
              </div>
              */}

              <Separator />

              {/* (Other filters as needed) */}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Designers</h1>
            <p className="text-gray-600 mb-4">Luxury and streetwear from the world's most coveted brands.</p>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search 5,000+ designer items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Popular Brands */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Popular Brands</h2>
              <div className="flex gap-2 flex-wrap">
                {designerBrands.slice(0, 8).map((brand) => (
                  <Button
                    key={brand}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm(brand)}
                    className="text-sm"
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${filteredListings.length} item${filteredListings.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
                <p className="text-gray-500">Loading designer items...</p>
              </CardContent>
            </Card>
          ) : filteredListings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 mb-4">No items match your current filters.</p>
                <Button onClick={() => {
                  setFilters({ category: [], brand: [], condition: [], size: [] })
                  setSearchTerm("")
                }} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ItemCard 
                  key={listing.id} 
                  item={{
                    id: listing.id,
                    name: listing.title,
                    price: listing.price,
                    imageUrl: listing.images[0] || "/placeholder.svg?height=400&width=300",
                    designer: listing.brand || "Unknown Brand",
                    size: listing.size || "N/A",
                    isNew: new Date(listing.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
