"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const result = await auth.requestPasswordReset(email)
      if (result.success) {
        setSuccess(
          "If an account with this email exists, we've sent password reset instructions. Please check your email.",
        )
        // For demo purposes, generate a reset link
        const mockToken = `MOCK_RESET_${Date.now()}`
        const resetLink = `${window.location.origin}/reset-password?token=${mockToken}&email=${encodeURIComponent(email)}`
        console.log("Demo Reset Link:", resetLink)
        setTimeout(() => {
          alert(`Demo Reset Link (check console): ${resetLink}`)
        }, 1000)
      } else {
        setError(result.error || "Failed to send reset instructions.")
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
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
              {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
              {success && <p className="mb-4 text-center text-sm text-green-600">{success}</p>}
              <Button type="submit" disabled={loading || !!success}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
              <Button variant="link" asChild className="mt-2">
                <Link href="/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageTransition>
  )
}
