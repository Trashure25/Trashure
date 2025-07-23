"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Listing } from "@/lib/listings"
import { listingsService } from "@/lib/listings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, isLoading: authLoading } = useAuth()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    brand: "",
    size: "",
  })

  const categories = [
    "Menswear",
    "Womenswear",
    "Sneakers",
    "Accessories",
    "Denim",
    "Streetwear",
    "Vintage",
    "Designer",
    "Household & Dorm",
  ]
  const conditions = ["New with tags", "Like new", "Good", "Fair", "Poor"]

  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to edit listings.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const fetchListing = async () => {
      try {
        setLoading(true)
        const listingData = await listingsService.getListingById(params.id as string)
        if (!listingData) {
          toast({
            title: "Listing not found",
            description: "The listing you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/my-listings")
          return
        }

        if (currentUser && listingData.userId !== currentUser.id) {
          toast({
            title: "Access denied",
            description: "You can only edit your own listings.",
            variant: "destructive",
          })
          router.push("/my-listings")
          return
        }

        setListing(listingData)
        setFormData({
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          condition: listingData.condition,
          price: listingData.price.toString(),
          brand: listingData.brand || "",
          size: listingData.size || "",
        })
      } catch (error) {
        console.error("Failed to fetch listing", error)
        toast({
          title: "Error",
          description: "Could not load listing details.",
          variant: "destructive",
        })
        router.push("/my-listings")
      } finally {
        setLoading(false)
      }
    }

    if (params.id && currentUser) {
      fetchListing()
    }
  }, [params.id, currentUser, authLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listing || !currentUser) return

    setIsSubmitting(true)

    try {
      await listingsService.updateListing(listing.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        price: Number(formData.price),
        brand: formData.brand,
        size: formData.size,
      })

      toast({
        title: "Success!",
        description: "Your listing has been updated.",
        className: "bg-green-100 text-green-800",
      })
      router.push("/my-listings")
    } catch (error) {
      console.error("Failed to update listing:", error)
      toast({
        title: "Update Failed",
        description: "Could not update your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!currentUser || !listing) {
    return null
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
            <CardDescription>Update your item details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Current Photos</Label>
                <div className="grid grid-cols-5 gap-2">
                  {listing.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={listing.images[0] || "/placeholder.svg?height=400&width=300"}
                        alt={listing.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Levi's 501 Jeans"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item's condition, fit, and any other details..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                    value={formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("condition", value)}
                    required
                    value={formData.condition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Nike, Adidas, Supreme"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., M, 32, 9.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (Credits) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="w-40" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
