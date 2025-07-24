"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Filter, Clock, DollarSign } from "lucide-react"
import type { Listing } from "@/lib/listings"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"

interface CategoryFiltersProps {
  listings: Listing[]
  filteredListings: Listing[]
  onFiltersChange: (filters: any) => void
  onSortChange: (sortBy: string) => void
  categoryOptions: string[]
  categoryPrefix: string
}

export function CategoryFilters({
  listings,
  filteredListings,
  onFiltersChange,
  onSortChange,
  categoryOptions,
  categoryPrefix
}: CategoryFiltersProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    category: [] as string[],
    brand: [] as string[],
    condition: [] as string[],
    size: [] as string[],
  })

  // Get unique values for filters
  const uniqueBrands = [...new Set(listings.map(item => item.brand).filter(Boolean))]
  const uniqueConditions = [...new Set(listings.map(item => item.condition))]
  const uniqueSizes = [...new Set(listings.map(item => item.size).filter(Boolean))]

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const newFilters = {
      ...filters,
      [filterType]: checked 
        ? [...filters[filterType as keyof typeof filters], value]
        : filters[filterType as keyof typeof filters].filter(item => item !== value)
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    onSortChange(newSortBy)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: [],
      brand: [],
      condition: [],
      size: [],
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sort By */}
        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="price-low">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="price-high">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price: High to Low
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Category Filter (Autocomplete + Checkboxes) */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <AdvancedAutocomplete
            options={categoryOptions}
            value={filters.category[0] || ""}
            onChange={v => onFiltersChange({ ...filters, category: v ? [v] : [] })}
            placeholder="Type or select a category"
            allowCustom={false}
          />
          <div className="space-y-2 mt-2">
            {categoryOptions.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category.includes(category)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      category: checked
                        ? [...filters.category, category]
                        : filters.category.filter((v: string) => v !== category)
                    })
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

        {/* Brand Filter (Autocomplete + Checkboxes) */}
        <div>
          <label className="text-sm font-medium mb-2 block">Brand</label>
          <AdvancedAutocomplete
            options={uniqueBrands}
            value={filters.brand[0] || ""}
            onChange={v => onFiltersChange({ ...filters, brand: v ? [v] : [] })}
            placeholder="Type or select a brand"
            allowCustom={true}
          />
          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand.includes(brand)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      brand: checked
                        ? [...filters.brand, brand]
                        : filters.brand.filter((v: string) => v !== brand)
                    })
                  }
                />
                <label htmlFor={`brand-${brand}`} className="text-sm">
                  {brand}
                </label>
              </div>
            ))}
          </div>
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
                    onFiltersChange({
                      ...filters,
                      condition: checked
                        ? [...filters.condition, condition]
                        : filters.condition.filter((v: string) => v !== condition)
                    })
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

        {/* Size Filter (Autocomplete + Checkboxes) */}
        {uniqueSizes.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <AdvancedAutocomplete
              options={uniqueSizes}
              value={filters.size[0] || ""}
              onChange={v => onFiltersChange({ ...filters, size: v ? [v] : [] })}
              placeholder="Type or select a size"
              allowCustom={true}
            />
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
              {uniqueSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={filters.size.includes(size!)}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        size: checked
                          ? [...filters.size, size!]
                          : filters.size.filter((v: string) => v !== size!)
                      })
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
  )
} 