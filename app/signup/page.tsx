"use client"
import { useState } from "react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    // Simulate account creation (no storage)
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    }, 800)
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