"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRef, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/loading"
import { ChangePasswordForm } from "@/components/change-password-form"
import { ProfileInformationForm } from "@/components/profile-information-form"
import { useToast } from "@/hooks/use-toast"

export default function AccountSettingsPage() {
  const { currentUser, logout, isLoading, updateAvatar } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // In a real app, you'd upload this to a storage service (e.g., Vercel Blob)
      // and get back a URL. For this mock, we'll use a local object URL.
      const localUrl = URL.createObjectURL(file)
      await updateAvatar(localUrl)
      toast({
        title: "Success",
        description: "Avatar updated.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update avatar."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!currentUser) {
    if (typeof window !== "undefined") {
      router.push("/login")
    }
    return <Loading />
  }

  return (
    <div className="bg-gray-50/90 min-h-screen">
      <div className="container mx-auto py-8 px-4 md:py-12">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-1 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {currentUser.firstName?.[0]?.toUpperCase()}
                    {currentUser.lastName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {currentUser.firstName} {currentUser.lastName}
                  </CardTitle>
                  <CardDescription>@{currentUser.username}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
                <Button className="w-full" onClick={() => avatarInputRef.current?.click()}>
                  Change Avatar
                </Button>
              </CardContent>
            </Card>

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
                  <Link href="/purchase-credits">Purchase Credits</Link>
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="link"
                  onClick={handleLogout}
                  className="p-0 h-auto text-base text-red-600 hover:text-red-700 font-normal"
                >
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            <ProfileInformationForm user={currentUser} />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
