// lib/listings.ts
// Database-backed listings service

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
  user?: {
    firstName: string
    lastName: string
    username: string
  }
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

export const listingsService = {
  async createListing(data: CreateListingData): Promise<Listing> {
    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create listing');
    }

    return response.json();
  },

  async getListingsForUser(userId: string): Promise<Listing[]> {
    console.log('listingsService.getListingsForUser called with userId:', userId)
    const response = await fetch(`/api/listings?userId=${userId}`);
    
    console.log('API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error('Failed to fetch user listings');
    }

    const data = await response.json();
    console.log('API response data:', data)
    // Handle new paginated response format
    const listings = data.listings || data; // Fallback for old format
    console.log('Processed listings:', listings)
    return listings;
  },

  async getAllListings(): Promise<Listing[]> {
    const response = await fetch('/api/listings');
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    const data = await response.json();
    // Handle new paginated response format
    return data.listings || data; // Fallback for old format
  },

  async getListingById(id: string): Promise<Listing | null> {
    const response = await fetch(`/api/listings/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch listing');
    }

    return response.json();
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
    const response = await fetch(`/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to update listing');
    }

    return response.json();
  },

  async deleteListing(id: string): Promise<boolean> {
    const response = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      throw new Error('Failed to delete listing');
    }

    return true;
  },
}
