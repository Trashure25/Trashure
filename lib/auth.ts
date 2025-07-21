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

// --- Mock User Type ---
export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  passwordHash: string
  avatarUrl?: string
  trustScore: number
}

// --- Mock Database using localStorage ---
const USERS_KEY = "trashure_users"
const SESSION_KEY = "trashure_session"

const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []
  try {
    const usersJson = localStorage.getItem(USERS_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  } catch (error) {
    console.error("Failed to parse users from localStorage", error)
    return []
  }
}

const storeUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// --- Mock Authentication Service ---
export const auth = {
  async signup(data: SignupData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
    const users = getStoredUsers()

    if (users.some((user) => user.email === data.email)) {
      throw new Error("An account with this email already exists.")
    }
    if (users.some((user) => user.username === data.username)) {
      throw new Error("This username is already taken.")
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash: `hashed_${data.password}`, // In a real app, use bcrypt
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${data.firstName} ${data.lastName}`,
      trustScore: Math.floor(Math.random() * 30) + 70, // Assign a random score between 70-99
    }

    storeUsers([...users, newUser])
    return newUser
  },

  async login(data: LoginData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = getStoredUsers()
    const user = users.find((u) => u.email === data.email)

    if (!user || user.passwordHash !== `hashed_${data.password}`) {
      throw new Error("Invalid email or password.")
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }))
    }
    return user
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null
    const sessionJson = localStorage.getItem(SESSION_KEY)
    if (!sessionJson) return null

    try {
      const { userId } = JSON.parse(sessionJson)
      if (!userId) return null

      const users = getStoredUsers()
      const user = users.find((u) => u.id === userId)
      return user || null
    } catch (error) {
      console.error("Failed to parse session from localStorage", error)
      return null
    }
  },

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) throw new Error("User not found.")

    const updatedUser = { ...users[userIndex], ...data }
    users[userIndex] = updatedUser
    storeUsers(users)
    return updatedUser
  },

  async changePassword(userId: string, data: PasswordChangeData): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) throw new Error("User not found.")
    if (users[userIndex].passwordHash !== `hashed_${data.currentPassword}`) {
      throw new Error("Incorrect current password.")
    }

    users[userIndex].passwordHash = `hashed_${data.newPassword}`
    storeUsers(users)
  },

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) throw new Error("User not found.")

    users[userIndex].avatarUrl = avatarUrl
    storeUsers(users)
    return users[userIndex]
  },
}
