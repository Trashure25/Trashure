"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Save, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface SearchFilters {
  category: string[]
  brand: string[]
  designer: string[]
  condition: string[]
  size: string[]
  style: string[]
  color: string[]
  material: string[]
  season: string[]
  era: string[]
  releaseYear: number[]
  collaboration: string[]
  exclusivity: string[]
  department: string[]
  location: string[]
  minPrice: number
  maxPrice: number
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  emailNotifications: boolean
  createdAt: string
}

interface AutocompleteSuggestion {
  type: string
  value: string
  label: string
}

const CONDITION_OPTIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']
const STYLE_OPTIONS = ['luxury', 'vintage', 'avant-garde', 'streetwear', 'workwear', 'gorpcore', 'sportswear', 'basics', 'western']
const SEASON_OPTIONS = ['spring', 'summer', 'fall', 'winter']
const ERA_OPTIONS = ['90s', '2000s', '2010s', '2020s']
const DEPARTMENT_OPTIONS = ['menswear', 'womenswear', 'unisex']
const EXCLUSIVITY_OPTIONS = ['limited edition', 'rare', 'exclusive', 'one of a kind']

const SIZE_OPTIONS = {
  tops: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  bottoms: ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
  footwear: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14', '15'],
  accessories: ['One Size']
}

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser } = useAuth()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [savingSearch, setSavingSearch] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    brand: [],
    designer: [],
    condition: [],
    size: [],
    style: [],
    color: [],
    material: [],
    season: [],
    era: [],
    releaseYear: [],
    collaboration: [],
    exclusivity: [],
    department: [],
    location: [],
    minPrice: 0,
    maxPrice: 10000
  })

  // Load saved searches
  useEffect(() => {
    if (currentUser) {
      loadSavedSearches()
    }
  }, [currentUser])

  // Load filters from URL params
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {}
    
    // Parse URL parameters and set filters
    searchParams.forEach((value, key) => {
      if (key === 'q') return
      if (key === 'minPrice') urlFilters.minPrice = parseInt(value)
      else if (key === 'maxPrice') urlFilters.maxPrice = parseInt(value)
      else if (key === 'releaseYear') urlFilters.releaseYear = [parseInt(value)]
      else if (key === 'category' || key === 'brand' || key === 'designer' || key === 'condition' || key === 'size' || key === 'style' || key === 'color' || key === 'material' || key === 'season' || key === 'era' || key === 'collaboration' || key === 'exclusivity' || key === 'department' || key === 'location') {
        (urlFilters as any)[key] = value.split(',')
      }
    })
    
    setFilters(prev => ({ ...prev, ...urlFilters }))
  }, [searchParams])

  const loadSavedSearches = async () => {
    try {
      const response = await fetch('/api/saved-searches')
      if (response.ok) {
        const data = await response.json()
        setSavedSearches(data.savedSearches)
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error)
    }
  }

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    
    if (query.trim()) {
      params.set('q', query.trim())
    }
    
    // Add filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','))
      } else if (typeof value === 'number' && value > 0) {
        params.set(key, value.toString())
      }
    })
    
    router.push(`/search?${params.toString()}`)
  }, [query, filters, router])

  const handleAutocomplete = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    try {
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
    }
  }, [])

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    handleSearch()
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: string | number) => {
    setFilters(prev => {
      const current = prev[filterType]
      if (Array.isArray(current)) {
        if (typeof value === 'string') {
          const newArray = current.includes(value)
            ? current.filter((item: string) => item !== value)
            : [...current, value]
          return { ...prev, [filterType]: newArray }
        }
      }
      return { ...prev, [filterType]: value }
    })
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      designer: [],
      condition: [],
      size: [],
      style: [],
      color: [],
      material: [],
      season: [],
      era: [],
      releaseYear: [],
      collaboration: [],
      exclusivity: [],
      department: [],
      location: [],
      minPrice: 0,
      maxPrice: 10000
    })
  }

  const saveSearch = async () => {
    if (!currentUser) {
      toast.error('Please log in to save searches')
      return
    }
    
    const name = prompt('Enter a name for this search:')
    if (!name) return
    
    setSavingSearch(true)
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          query,
          filters
        })
      })
      
      if (response.ok) {
        toast.success('Search saved successfully')
        loadSavedSearches()
      } else {
        toast.error('Failed to save search')
      }
    } catch (error) {
      toast.error('Failed to save search')
    } finally {
      setSavingSearch(false)
    }
  }

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query)
    setFilters(savedSearch.filters)
    setShowSavedSearches(false)
    handleSearch()
  }

  const deleteSavedSearch = async (id: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Search deleted')
        loadSavedSearches()
      } else {
        toast.error('Failed to delete search')
      }
    } catch (error) {
      toast.error('Failed to delete search')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for items, brands, designers..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleAutocomplete(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false)
                  handleSearch()
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              className="pl-10 pr-4"
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                    <span>{suggestion.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
          
          <Select
            value={searchParams.get('sortBy') || 'newest'}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('sortBy', value);
              router.push(`/search?${params.toString()}`);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {currentUser && (
            <Button
              variant="outline"
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Saved
            </Button>
          )}
        </div>
      </div>

      {/* Saved Searches Dropdown */}
      {showSavedSearches && savedSearches.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">Saved Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.map((savedSearch) => (
                <div key={savedSearch.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{savedSearch.name}</div>
                    <div className="text-sm text-gray-600">{savedSearch.query}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => loadSavedSearch(savedSearch)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSavedSearch(savedSearch.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-4 bg-gray-50 border-gray-200">
          <CardHeader className="bg-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Advanced Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-gray-700 hover:text-gray-900 hover:bg-gray-200">
                  Clear All
                </Button>
                {currentUser && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveSearch}
                    disabled={savingSearch}
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                  >
                    {savingSearch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Search
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Category</label>
                <div className="space-y-2">
                  {['Apparel', 'Footwear', 'Accessories', 'Household'].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category.includes(category)}
                        onCheckedChange={() => handleFilterChange('category', category)}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Brand</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['Nike', 'Adidas', 'Jordan', 'Supreme', 'Palace', 'Off-White', 'Balenciaga', 'Gucci', 'Louis Vuitton', 'Vintage', 'Maison Margiela'].map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brand.includes(brand)}
                        onCheckedChange={() => handleFilterChange('brand', brand)}
                      />
                      <label htmlFor={`brand-${brand}`} className="text-sm text-gray-700">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Condition</label>
                <div className="space-y-2">
                  {CONDITION_OPTIONS.map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.condition.includes(condition)}
                        onCheckedChange={() => handleFilterChange('condition', condition)}
                      />
                      <label htmlFor={`condition-${condition}`} className="text-sm text-gray-700">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Style</label>
                <div className="space-y-2">
                  {STYLE_OPTIONS.map(style => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={filters.style.includes(style)}
                        onCheckedChange={() => handleFilterChange('style', style)}
                      />
                      <label htmlFor={`style-${style}`} className="text-sm capitalize text-gray-700">
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Department</label>
                <div className="space-y-2">
                  {DEPARTMENT_OPTIONS.map(dept => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={filters.department.includes(dept)}
                        onCheckedChange={() => handleFilterChange('department', dept)}
                      />
                      <label htmlFor={`dept-${dept}`} className="text-sm capitalize text-gray-700">
                        {dept}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Season</label>
                <div className="space-y-2">
                  {SEASON_OPTIONS.map(season => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={filters.season.includes(season)}
                        onCheckedChange={() => handleFilterChange('season', season)}
                      />
                      <label htmlFor={`season-${season}`} className="text-sm capitalize text-gray-700">
                        {season}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Era */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Era</label>
                <div className="space-y-2">
                  {ERA_OPTIONS.map(era => (
                    <div key={era} className="flex items-center space-x-2">
                      <Checkbox
                        id={`era-${era}`}
                        checked={filters.era.includes(era)}
                        onCheckedChange={() => handleFilterChange('era', era)}
                      />
                      <label htmlFor={`era-${era}`} className="text-sm text-gray-700">
                        {era}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Size</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.size.includes(size)}
                        onCheckedChange={() => handleFilterChange('size', size)}
                      />
                      <label htmlFor={`size-${size}`} className="text-sm text-gray-700">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Color</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray', 'Orange', 'Multi'].map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={filters.color.includes(color)}
                        onCheckedChange={() => handleFilterChange('color', color)}
                      />
                      <label htmlFor={`color-${color}`} className="text-sm text-gray-700">
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-800">Material</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {['Cotton', 'Leather', 'Denim', 'Wool', 'Silk', 'Polyester', 'Linen', 'Suede', 'Canvas', 'Mesh'].map(material => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={`material-${material}`}
                        checked={filters.material.includes(material)}
                        onCheckedChange={() => handleFilterChange('material', material)}
                      />
                      <label htmlFor={`material-${material}`} className="text-sm text-gray-700">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-4 block text-gray-800">Price Range</label>
              <div className="space-y-4">
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => {
                    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
                  }}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Min Price</label>
                    <Input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Max Price</label>
                    <Input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 10000 }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Release Year */}
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block text-gray-800">Release Year</label>
              <Input
                type="number"
                placeholder="e.g., 2020"
                value={filters.releaseYear[0] || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  releaseYear: e.target.value ? [parseInt(e.target.value)] : [] 
                }))}
                min="1900"
                max="2024"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 