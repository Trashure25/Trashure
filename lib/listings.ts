// lib/listings.ts
// Mock listings service using localStorage

export interface Listing {
  id: string
  userId: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  brand?: string
  size?: string
  images: string[]
  status: "active" | "sold" | "draft"
  createdAt: string
  updatedAt: string
}

export interface CreateListingData {
  userId: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  brand?: string
  size?: string
  images: string[]
}

const LISTINGS_KEY = "trashure_listings"

// Helper to get listings from localStorage
const getListings = (): Listing[] => {
  if (typeof window === "undefined") return []
  try {
    const listings = localStorage.getItem(LISTINGS_KEY)
    return listings ? JSON.parse(listings) : []
  } catch (e) {
    return []
  }
}

// Helper to save listings to localStorage
const saveListings = (listings: Listing[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

export const listingsService = {
  async createListing(data: CreateListingData): Promise<Listing> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      userId: data.userId,
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition,
      price: data.price,
      brand: data.brand,
      size: data.size,
      images: data.images,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const listings = getListings()
    listings.push(newListing)
    saveListings(listings)

    return newListing
  },

  async getListingsForUser(userId: string): Promise<Listing[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const listings = getListings()
    return listings.filter((listing) => listing.userId === userId)
  },

  async getAllListings(): Promise<Listing[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return getListings()
  },

  async getListingById(id: string): Promise<Listing | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const listings = getListings()
    return listings.find((listing) => listing.id === id) || null
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const listings = getListings()
    const index = listings.findIndex((listing) => listing.id === id)

    if (index === -1) return null

    listings[index] = {
      ...listings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    saveListings(listings)
    return listings[index]
  },

  async deleteListing(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const listings = getListings()
    const filteredListings = listings.filter((listing) => listing.id !== id)

    if (filteredListings.length === listings.length) return false

    saveListings(filteredListings)
    return true
  },
}
