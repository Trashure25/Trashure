import { z } from "zod"

// --- Validation Schemas ---
export const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const profileUpdateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
})

// --- Type Definitions ---
export interface SignupData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ProfileUpdateData {
  firstName: string
  lastName: string
  username: string
  email: string
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// --- User Type ---
export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  avatarUrl?: string
  trustScore: number
  credits: number
  role: string
  isBanned: boolean
  banReason?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

// --- Real API Authentication Service ---
export const auth = {
  async signup(data: SignupData): Promise<User> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create account')
    }
    return await response.json()
  },

  async login(data: LoginData): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid email or password')
    }
    const user = await response.json()
    return user
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  },

  async getCurrentUser(): Promise<User | null> {
    try {

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
      

      
      if (!response.ok) {

        return null
      }
      
      const user = await response.json()

      return user
    } catch (error) {

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
    const response = await fetch('/api/auth/request-password-reset', {
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

  async updateUserCredits(userId: string, credits: number): Promise<void> {
    const response = await fetch(`/api/users/${userId}/credits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credits }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update credits')
    }
  },

  async resetPassword(data: { email: string; newPassword: string; token: string }): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }

    return { success: true }
  },

  async sendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/auth/send-verification-email', {
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

  async verifyEmail(data: { email: string; token: string }): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }

    return { success: true }
  },
}
