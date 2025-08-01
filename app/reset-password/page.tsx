"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [isValidLink, setIsValidLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (email && token) {
      setIsValidLink(true)
    } else if (!email || !token) {
      setError("This password reset link is missing required information.")
      setIsValidLink(false)
    } else {
      setError("This password reset link is invalid or has expired.")
      setIsValidLink(false)
    }
  }, [email, token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!isValidLink || !email) {
      setError("Cannot reset password with an invalid link.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const result = await auth.resetPassword({ email, newPassword: password, token })
      if (result.success) {
        setSuccess("Your password has been reset successfully! You will be redirected to the homepage shortly.")
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setError(result.error || "Failed to reset password.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            {isValidLink && <CardDescription>Enter a new password for your account: {email}</CardDescription>}
          </CardHeader>
          {isValidLink ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || !!success}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!success}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading || !!success}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || !!success}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch">
                {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
                {success && <p className="mb-4 text-center text-sm text-green-600">{success}</p>}
                <Button type="submit" disabled={loading || !!success}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent>
              <p className="text-center text-sm text-red-600">{error}</p>
              <Button variant="link" asChild className="mt-4 w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </PageTransition>
  )
}
