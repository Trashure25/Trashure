// Mock database interfaces and data
export interface User {
  id: string
  email: string
  passwordHash: string // In a real app, this would be a secure hash
  firstName: string
  lastName: string
  username: string
  credits: number
  cart: string[] // Array of item IDs
}

export interface Item {
  id: string
  name: string
  price: number
  imageUrl: string
  seller: string
}

export interface Listing {
  id: string
  userId: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  brand?: string
  size?: string
  status: "active" | "sold" | "draft"
  images: string[]
  createdAt: string
}
