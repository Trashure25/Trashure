import { z } from "zod"

// --- Validation Schemas ---
export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email(), // Email is read-only in the form
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })

export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

// --- User Type ---
export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  passwordHash: string
  avatarUrl?: string
  trustScore: number
  createdAt: string
  updatedAt: string
}

// --- Real API Authentication Service ---
export const auth = {
  async signup(data: SignupData): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password, // Note: This should be hashed on the server
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create account')
    }

    const user = await response.json()
    return user
  },

  async login(data: LoginData): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid email or password')
    }

    const user = await response.json()
    
    // Store session in localStorage for client-side persistence
    if (typeof window !== "undefined") {
      localStorage.setItem('trashure_session', JSON.stringify({ userId: user.id }))
    }
    
    return user
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem('trashure_session')
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null
    
    const sessionJson = localStorage.getItem('trashure_session')
    if (!sessionJson) return null

    try {
      const { userId } = JSON.parse(sessionJson)
      if (!userId) return null

      // Fetch current user from API
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        localStorage.removeItem('trashure_session')
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get current user", error)
      localStorage.removeItem('trashure_session')
      return null
    }
  },

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update profile')
    }

    return await response.json()
  },

  async changePassword(userId: string, data: PasswordChangeData): Promise<void> {
    const response = await fetch(`/api/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to change password')
    }
  },

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatarUrl }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update avatar')
    }

    return await response.json()
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }

    return { success: true }
  },
}
