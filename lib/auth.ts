import { z } from "zod"

// Define the schema for a user
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  username: z.string(),
  credits: z.number().default(0),
  avatarUrl: z.string().url().optional().nullable(),
})

export type User = z.infer<typeof userSchema>

// Define schemas for auth operations
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
    message: "Passwords don't match",
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
  email: z.string().email("Invalid email address"),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })

export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

// --- Mock Authentication Service ---
// In a real app, this would interact with your database and authentication provider.

const MOCK_DELAY = 1000
const users: User[] = []
let loggedInUser: User | null = null

const authService = {
  signup: async (data: SignupData): Promise<{ success: true }> => {
    console.log("Attempting signup for:", data.email)
    await new Promise((res) => setTimeout(res, MOCK_DELAY))

    if (users.find((u) => u.email === data.email)) {
      throw new Error("An account with this email already exists.")
    }
    if (users.find((u) => u.username === data.username)) {
      throw new Error("This username is already taken.")
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      credits: 10, // Start with some credits
      avatarUrl: null,
    }
    users.push(newUser)
    console.log("Signup successful:", newUser)
    return { success: true }
  },

  login: async (data: LoginData): Promise<User> => {
    console.log("Attempting login for:", data.email)
    await new Promise((res) => setTimeout(res, MOCK_DELAY))

    const user = users.find((u) => u.email === data.email)
    // In a real app, you would also check the password hash
    if (!user) {
      throw new Error("Invalid email or password.")
    }

    loggedInUser = user
    localStorage.setItem("trashure-user-token", user.id) // Mock session
    console.log("Login successful:", loggedInUser)
    return loggedInUser
  },

  logout: async (): Promise<void> => {
    console.log("Logging out.")
    await new Promise((res) => setTimeout(res, 500))
    loggedInUser = null
    localStorage.removeItem("trashure-user-token")
  },

  getCurrentUser: async (): Promise<User | null> => {
    console.log("Getting current user...")
    await new Promise((res) => setTimeout(res, 500))
    const token = localStorage.getItem("trashure-user-token")
    if (token) {
      const user = users.find((u) => u.id === token)
      loggedInUser = user || null
    } else {
      loggedInUser = null
    }
    console.log("Current user is:", loggedInUser)
    return loggedInUser
  },

  updateProfile: async (userId: string, data: ProfileUpdateData): Promise<User> => {
    await new Promise((res) => setTimeout(res, MOCK_DELAY))
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found.")
    }
    users[userIndex] = { ...users[userIndex], ...data }
    loggedInUser = users[userIndex]
    return loggedInUser
  },

  changePassword: async (userId: string, data: PasswordChangeData): Promise<{ success: true }> => {
    await new Promise((res) => setTimeout(res, MOCK_DELAY))
    const user = users.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found.")
    }
    // In a real app, you'd verify the currentPassword
    console.log("Password changed successfully for", user.email)
    return { success: true }
  },
  updateAvatar: async (userId: string, avatarUrl: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, MOCK_DELAY))
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found.")
    }
    users[userIndex].avatarUrl = avatarUrl
    if (loggedInUser?.id === userId) {
      loggedInUser = users[userIndex]
    }
    return users[userIndex]
  },
}

export const auth = authService
