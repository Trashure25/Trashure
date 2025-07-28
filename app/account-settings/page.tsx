"use client"

import { useAuth } from "@/contexts/auth-context"
import { type ProfileUpdateData, profileUpdateSchema, type PasswordChangeData, passwordChangeSchema } from "@/lib/auth"

import { useEffect, useRef, type ChangeEvent } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TrustScoreCard } from "@/components/trust-score-card"

function ProfileForm() {
  const { currentUser, updateProfile, updateAvatar } = useAuth()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        username: currentUser.username,
        email: currentUser.email,
      })
    }
  }, [currentUser, form])

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    toast.promise(
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            await updateAvatar(reader.result as string)
            resolve("Avatar updated!")
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      }),
      {
        loading: "Uploading avatar...",
        success: "Avatar updated successfully!",
        error: (err) => err.message || "Failed to update avatar.",
      },
    )
  }

  const onSubmit = async (data: ProfileUpdateData) => {
    toast.promise(updateProfile(data), {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: (err) => err.message || "Failed to update profile.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your public profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser?.avatarUrl ?? undefined} />
                <AvatarFallback className="text-3xl">
                  {currentUser?.firstName?.[0]}
                  {currentUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
              <Button type="button" variant="outline" onClick={() => avatarInputRef.current?.click()}>
                Change Photo
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function PasswordForm() {
  const { changePassword } = useAuth()
  const form = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit = async (data: PasswordChangeData) => {
    toast.promise(changePassword(data), {
      loading: "Changing password...",
      success: () => {
        form.reset()
        return "Password changed successfully!"
      },
      error: (err) => err.message || "Failed to change password.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Choose a strong new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function AccountSettingsPage() {
  const { currentUser, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace("/login")
    }
  }, [isLoading, currentUser, router])

  const handleLogout = async () => {
    toast.promise(logout(), {
      loading: "Logging out...",
      success: () => {
        router.push("/")
        return "You have been logged out."
      },
      error: "Logout failed. Please try again.",
    })
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50/90 min-h-screen">
      <main className="container mx-auto max-w-6xl py-8 px-4 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and security settings.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <aside className="md:col-span-1 lg:col-span-1 space-y-6">
            <TrustScoreCard score={currentUser.trustScore} />
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col items-start space-y-2">
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-base text-gray-700 hover:text-primary font-normal"
                >
                  <Link href="/my-listings">My Listings</Link>
                </Button>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-base text-gray-700 hover:text-primary font-normal"
                >
                  <Link href="/favorites">My Favorites</Link>
                </Button>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-base text-gray-700 hover:text-primary font-normal"
                >
                  <Link href="/messages">My Messages</Link>
                </Button>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-base text-gray-700 hover:text-primary font-normal"
                >
                  <Link href="/purchase-credits">Purchase Credits</Link>
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-base font-bold"
                >
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            <ProfileForm />
            <PasswordForm />
          </div>
        </div>
      </main>
    </div>
  )
}
