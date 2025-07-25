// lib/favorites.ts
// Favorites service for managing user favorites

export interface Favorite {
  id: string
  userId: string
  listingId: string
  createdAt: string
  listing?: {
    id: string
    title: string
    price: number
    brand?: string
    size?: string
    condition: string
    category: string
    images: string[]
    status: string
  }
}

export interface CreateFavoriteData {
  userId: string
  listingId: string
}

export const favoritesService = {
  async addFavorite(data: CreateFavoriteData): Promise<Favorite> {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }

    return response.json();
  },

  async removeFavorite(favoriteId: string): Promise<boolean> {
    const response = await fetch(`/api/favorites/${favoriteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }

    return true;
  },

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const response = await fetch(`/api/favorites?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user favorites');
    }

    return response.json();
  },

  async checkIfFavorited(userId: string, listingId: string): Promise<boolean> {
    const response = await fetch(`/api/favorites/check?userId=${userId}&listingId=${listingId}`);
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isFavorited;
  },

  async getFavoriteId(userId: string, listingId: string): Promise<string | null> {
    const response = await fetch(`/api/favorites/check?userId=${userId}&listingId=${listingId}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.favoriteId || null;
  }
}; 