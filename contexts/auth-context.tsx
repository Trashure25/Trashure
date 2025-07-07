"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import {
  auth,
  type User,
  type LoginData,
  type SignupData,
  type ProfileUpdateData,
  type PasswordChangeData,
} from "@/lib/auth"

interface AuthContextType {
  currentUser: User | null
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: ProfileUpdateData) => Promise<void>
  changePassword: (data: PasswordChangeData) => Promise<void>
  updateAvatar: (avatarUrl: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const user = await auth.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load user", error)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (data: LoginData) => {
    const user = await auth.login(data)
    setCurrentUser(user)
  }

  const signup = async (data: SignupData) => {
    await auth.signup(data)
  }

  const logout = async () => {
    await auth.logout()
    setCurrentUser(null)
  }

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!currentUser) throw new Error("Not authenticated")
    const updatedUser = await auth.updateProfile(currentUser.id, data)
    setCurrentUser(updatedUser)
  }

  const changePassword = async (data: PasswordChangeData) => {
    if (!currentUser) throw new Error("Not authenticated")
    await auth.changePassword(currentUser.id, data)
  }

  const updateAvatar = async (avatarUrl: string) => {
    if (!currentUser) throw new Error("Not authenticated")
    const updatedUser = await auth.updateAvatar(currentUser.id, avatarUrl)
    setCurrentUser(updatedUser)
  }

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    updateAvatar,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
