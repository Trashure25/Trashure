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
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
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
    "Menswear - Tops",
    "Menswear - Bottoms", 
    "Menswear - Footwear",
    "Menswear - Formal Wear",
    "Womenswear - Tops",
    "Womenswear - Bottoms",
    "Womenswear - Footwear",
    "Womenswear - Accessories",
    "Household - Furniture",
    "Household - Appliances",
    "Household - Decor",
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

  const handleCategorySelect = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleBrandSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, brand: value }))
  }

  const handleConditionSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, condition: value }))
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
                        src={image || "/placeholder.svg"}
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
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <AdvancedAutocomplete
                    id="category"
                    name="category"
                    options={categories}
                    value={formData.category}
                    onSelect={handleCategorySelect}
                    placeholder="Category"
                    allowCustom={true}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <AdvancedAutocomplete
                    id="brand"
                    name="brand"
                    options={[formData.brand].filter(Boolean)}
                    value={formData.brand}
                    onSelect={handleBrandSelect}
                    placeholder="Brand"
                    allowCustom={true}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition || ""}
                    onValueChange={handleConditionSelect}
                    required
                  >
                    <SelectTrigger 
                      className="h-12 w-full rounded-full bg-white px-5 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all hover:bg-[#06402B] hover:border-[#06402B] hover:text-white data-[state=open]:bg-[#06402B] data-[state=open]:border-[#06402B] data-[state=open]:text-white [&[data-placeholder]]:text-gray-400 text-black"
                      style={{ border: '1px solid #d1d5db' }}
                    >
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-300 bg-white">
                      <SelectItem value="New with tags" className="hover:bg-[#198154] hover:text-white">New with tags</SelectItem>
                      <SelectItem value="Like new" className="hover:bg-[#198154] hover:text-white">Like new</SelectItem>
                      <SelectItem value="Good" className="hover:bg-[#198154] hover:text-white">Good</SelectItem>
                      <SelectItem value="Fair" className="hover:bg-[#198154] hover:text-white">Fair</SelectItem>
                      <SelectItem value="Poor" className="hover:bg-[#198154] hover:text-white">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
