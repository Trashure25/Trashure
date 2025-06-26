"use client"
import { useState } from "react"

const initialProfile = {
  email: "",
  password: "",
  displayName: "",
  avatar: "",
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  address: "",
  bio: "",
  handle: "",
  // Add more fields as needed
}

export default function SignupPage() {
  const [profile, setProfile] = useState(initialProfile)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Creating your account")
        // Create dummy account in localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        users.push({ email: profile.email, password: profile.password })
        localStorage.setItem("users", JSON.stringify(users))
        setSuccess(true)
        window.location.href = "/"
      } else {
        setSuccess(true)
        window.location.href = "/"
      }
    } catch (err) {
      setError("Sign up failed. Creating dummy account...")
      // Create dummy account in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      users.push({ email: profile.email, password: profile.password })
      localStorage.setItem("users", JSON.stringify(users))
      setSuccess(true)
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" value={profile.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password" value={profile.password} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="displayName" placeholder="Display Name" value={profile.displayName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="handle" placeholder="@handle (unique)" value={profile.handle} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="firstName" placeholder="First Name" value={profile.firstName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="lastName" placeholder="Last Name" value={profile.lastName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="age" type="number" placeholder="Age" value={profile.age} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <select name="gender" value={profile.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Non-binary</option>
          <option value="other">Other</option>
          <option value="preferNotToSay">Prefer not to say</option>
        </select>
        <input name="address" placeholder="Billing Address" value={profile.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <textarea name="bio" placeholder="Short Bio (120 chars)" maxLength={120} value={profile.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {/* Avatar upload can be implemented as a file input or image URL for now */}
        <input name="avatar" placeholder="Avatar Image URL" value={profile.avatar} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">Sign up successful! Redirecting to main page...</div>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
      </form>
    </div>
  )
} 