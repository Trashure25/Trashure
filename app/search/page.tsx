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
import type { Listing } from "@/lib/listings"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Search, Loader2 } from "lucide-react"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    category: [] as string[],
    brand: [] as string[],
    condition: [] as string[],
    size: [] as string[],
  })
  const [brandOptions, setBrandOptions] = useState<string[]>([])

  // Fetch and search listings
  useEffect(() => {
    const fetchListings = async (retryCount = 0) => {
      try {
        console.log('Fetching listings for search...')
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch('/api/listings?limit=200', {
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const allListings = data.listings || data
        
        // Filter listings based on search query
        const searchResults = allListings.filter((listing: Listing) => {
          if (!query.trim()) return true
          
          const searchText = `${listing.title} ${listing.description} ${listing.brand || ''} ${listing.category}`.toLowerCase()
          const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
          
          return searchTerms.every(term => searchText.includes(term))
        })
        
        console.log('Search results:', searchResults.length)
        
        setListings(searchResults)
        setFilteredListings(searchResults)
        
        // Extract unique brands for filter options
        const brands = [...new Set(searchResults.map(item => item.brand).filter(Boolean))]
        setBrandOptions(brands.sort())
        
      } catch (error) {
        console.error('Error fetching search results:', error)
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}`)
          setTimeout(() => fetchListings(retryCount + 1), 1000 * (retryCount + 1))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [query])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...listings]

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category))
    }

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

  if (loading) {
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        </div>
        {query && (
          <p className="text-gray-600">
            Showing results for "<span className="font-medium">{query}</span>"
          </p>
        )}
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

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  {['Apparel', 'Footwear', 'Accessories', 'Household'].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category.includes(category)}
                        onCheckedChange={() => handleFilterChange('category', category)}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Brand Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <AdvancedAutocomplete
                  options={brandOptions}
                  placeholder="Search brands..."
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
              <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                {query ? `No items found for "${query}". Try adjusting your search terms or filters.` : 'No items available.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  Showing {filteredListings.length} of {listings.length} results
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