"use client"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function validatePassword(pw: string) {
    // At least 6 chars, at least one letter, one number, one symbol
    return (
      pw.length >= 6 &&
      /[a-zA-Z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^a-zA-Z0-9]/.test(pw)
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)
    // Passwords must match
    if (password !== confirmPassword) {
      toast({
        title: "Unsuccessful signup",
        description: "Password does not match confirmation.",
        variant: "destructive",
      })
      setError("Passwords do not match.")
      return
    }
    // Password must meet requirements
    if (!validatePassword(password)) {
      toast({
        title: "Unsuccessful signup",
        description: "Password must be at least 6 characters and include letters, numbers, and symbols.",
        variant: "destructive",
      })
      setError("Password does not meet requirements.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName: name,
          handle: email.split("@")[0], // simple handle from email
          phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({
          title: "Unsuccessful signup",
          description: data.error || "Sign up failed.",
          variant: "destructive",
        })
        setError(data.error || "Sign up failed.")
      } else {
        toast({
          title: "Successful sign up!",
          description: `Welcome, ${name || email}!`,
          variant: "default",
        })
        setSuccess(true)
        // TODO: redirect to welcome/profile page after success
      }
    } catch (err) {
      toast({
        title: "Unsuccessful signup",
        description: "Sign up failed. Please try again.",
        variant: "destructive",
      })
      setError("Sign up failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-600">
            Account created for <b>{name}</b> ({email})! Redirecting to main page...
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={loading || !name || !email || !password || !confirmPassword || !phone}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
} 