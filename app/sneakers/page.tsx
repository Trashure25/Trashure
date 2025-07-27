"use client"

import { useEffect, useState } from "react"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CategoryFilters } from "@/components/category-filters"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { Listing } from "@/lib/listings"

export default function SneakersPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: [] as string[],
    brand: [] as string[],
    condition: [] as string[],
    size: [] as string[],
  })
  const [sortBy, setSortBy] = useState("newest")
  const [brandOptions, setBrandOptions] = useState<string[]>([])

  // Fetch sneaker listings
  useEffect(() => {
    const fetchListings = async (retryCount = 0) => {
      try {
        console.log('Fetching sneaker listings...')
        // Add timeout to prevent infinite loading
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased timeout to 15 seconds

        const response = await fetch('/api/listings?limit=100', {
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

        // Handle new paginated response format
        const listings = data.listings || data // Fallback for old format
        if (!Array.isArray(listings)) {
          throw new Error('Invalid response format')
        }

        const sneakerListings = listings.filter((listing: Listing) => 
          listing.category.includes('Footwear') || listing.category.includes('Sneakers')
        )
        console.log('Filtered sneaker listings:', sneakerListings)

        // Always set the real data, even if it's empty
        setListings(sneakerListings)
        setFilteredListings(sneakerListings)
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
              id: 'sneakers-1',
              title: 'Nike Air Jordan 1 Retro High OG',
              price: 4500,
              brand: 'Nike',
              size: 'US 10',
              condition: 'Like new',
              category: 'Menswear - Footwear',
              description: 'Classic Air Jordan 1 in Chicago colorway',
              images: ['/placeholder.svg'],
              createdAt: new Date().toISOString(),
              status: 'active'
            },
            {
              id: 'sneakers-2',
              title: 'Adidas Yeezy Boost 350 V2',
              price: 3800,
              brand: 'Adidas',
              size: 'US 9',
              condition: 'Good',
              category: 'Menswear - Footwear',
              description: 'Yeezy Boost 350 V2 in Zebra colorway',
              images: ['/placeholder.svg'],
              createdAt: new Date().toISOString(),
              status: 'active'
            },
            {
              id: 'sneakers-3',
              title: 'Converse Chuck Taylor All Star',
              price: 850,
              brand: 'Converse',
              size: 'US 8',
              condition: 'New with tags',
              category: 'Menswear - Footwear',
              description: 'Classic Chuck Taylor in white canvas',
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

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...listings]

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
  }, [listings, filters, sortBy])

  const categoryOptions = [
    "Running",
    "Basketball",
    "Lifestyle",
    "Skateboarding",
    "Limited Edition",
    "Vintage"
  ]

  const uniqueConditions = Array.from(new Set(listings.map(item => item.condition).filter(Boolean)))
  const uniqueSizes = Array.from(new Set(listings.map(item => item.size).filter(Boolean)))

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading sneakers...</p>
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
            <BreadcrumbPage>Sneakers</BreadcrumbPage>
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

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category.includes(category)}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({
                            ...prev,
                            category: checked ? [...prev.category, category] : prev.category.filter(v => v !== category)
                          }))
                        }
                      />
                      <label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
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

              <Separator />

              {/* Condition Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <div className="space-y-2">
                  {uniqueConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.condition.includes(condition)}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({
                            ...prev,
                            condition: checked ? [...prev.condition, condition] : prev.condition.filter(v => v !== condition)
                          }))
                        }
                      />
                      <label htmlFor={`condition-${condition}`} className="text-sm">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Size Filter */}
              {uniqueSizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uniqueSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={filters.size.includes(size!)}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev,
                              size: checked ? [...prev.size, size!] : prev.size.filter(v => v !== size!)
                            }))
                          }
                        />
                        <label htmlFor={`size-${size}`} className="text-sm">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Sneakers</h1>
            <p className="text-gray-600 mb-4">From iconic classics to the latest drops, find your next pair here.</p>
            <p className="text-sm text-gray-500">
              {filteredListings.length} item{filteredListings.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredListings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 mb-4">No items match your current filters.</p>
                <Button onClick={() => setFilters({ category: [], brand: [], condition: [], size: [] })} variant="outline">
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
