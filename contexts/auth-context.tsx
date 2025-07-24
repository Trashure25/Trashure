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
import { toast } from "sonner"

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

  // Reload user (for instant sync after login/logout)
  const reloadUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const user = await auth.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load and edge case handling
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    auth.getCurrentUser()
      .then(user => {
        if (!isMounted) return
        setCurrentUser(user)
      })
      .catch((error: any) => {
        if (!isMounted) return
        setCurrentUser(null)
        // Edge case: session expired, user deleted, or invalid token
        if (error?.status === 401 || error?.message?.includes('Not authenticated')) {
          toast.error('Session expired. Please log in again.')
        }
      })
      .finally(() => { if (isMounted) setIsLoading(false) })
    return () => { isMounted = false }
  }, [reloadUser])

  // Optionally: Listen for storage events to sync logout across tabs (future-proof)
  // useEffect(() => {
  //   const onStorage = (e: StorageEvent) => {
  //     if (e.key === 'logout') reloadUser()
  //   }
  //   window.addEventListener('storage', onStorage)
  //   return () => window.removeEventListener('storage', onStorage)
  // }, [reloadUser])

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
    // Optionally: localStorage.setItem('logout', Date.now().toString())
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
