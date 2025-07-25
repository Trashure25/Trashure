"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, Plus, Sparkles, Upload, X } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { evaluateItemPrice } from "@/app/actions/listing-actions"
import { listingsService } from "@/lib/listings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { AdvancedAutocomplete } from "@/components/ui/advanced-autocomplete"

// ---------- helpers ----------
const fileToBase64 = (file: File) =>
  new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result as string)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })

type PricingStatus = "idle" | "evaluating" | "evaluated" | "manual_fallback"

// ---------- component ----------
export default function ListItemPage() {
  const { currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<"upload" | "details">("upload")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Pricing state
  const [pricingStatus, setPricingStatus] = useState<PricingStatus>("idle")
  const [evaluatedPrice, setEvaluatedPrice] = useState<number | null>(null)
  const [manualPrice, setManualPrice] = useState("")

  // --- Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    condition: "",
    size: "",
    price: ""
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [brandOptions, setBrandOptions] = useState<string[]>([])

  // --- Fetch unique brands from listings on mount ---
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/listings")
        const data = await res.json()
        const brands = Array.from(new Set(data.map((item: any) => String(item.brand)).filter(Boolean))) as string[];
        setBrandOptions(brands)
      } catch (e) {
        setBrandOptions([])
      }
    }
    fetchBrands()
  }, [])

  // --- Categories ---
  const categories = useMemo(() => [
    "Menswear - T-Shirts & Tops",
    "Menswear - Pants & Jeans", 
    "Menswear - Outerwear",
    "Menswear - Shoes & Boots",
    "Menswear - Accessories",
    "Menswear - Formal Wear",
    "Womenswear - Dresses",
    "Womenswear - Tops & Blouses",
    "Womenswear - Pants & Jeans",
    "Womenswear - Skirts",
    "Womenswear - Outerwear", 
    "Womenswear - Shoes & Heels",
    "Womenswear - Accessories",
    "Sneakers - Running",
    "Sneakers - Basketball",
    "Sneakers - Lifestyle",
    "Sneakers - Skateboarding",
    "Sneakers - Limited Edition",
    "Sneakers - Vintage",
    "Household - Furniture",
    "Household - Kitchen & Dining",
    "Household - Bedding & Bath",
    "Household - Decor & Art",
    "Household - Electronics",
    "Household - Storage & Organization",
  ], [])

  // --- Static brand options fallback ---
  const staticBrandOptions = [
    "Nike", "Adidas", "New Balance", "Jordan", "Maison Margiela", "Converse", "Vans", "Asics", "Salomon", "Yeezy", "Reebok", "Puma", "Saucony", "Hoka", "Louis Vuitton", "Dior", "Gucci", "Prada", "Saint Laurent", "Balenciaga", "Off-White", "Stussy", "Essentials", "Fear of God", "Supreme", "Palace", "A Bathing Ape", "Comme des Garçons", "Vintage", "Chanel", "Miu Miu", "Fendi", "Celine", "Aime Leon Dore"
  ];
  const effectiveBrandOptions = useMemo(() => 
    brandOptions.length > 0 ? brandOptions : staticBrandOptions, 
    [brandOptions]
  );

  // ---------- guards ----------
  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to list an item.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [authLoading, currentUser, router])

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  // ---------- handlers ----------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const all = [...images, ...Array.from(files)].slice(0, 5)
    setImages(all)
    previews.forEach(URL.revokeObjectURL)
    setPreviews(all.map((f) => URL.createObjectURL(f)))
  }

  const removeImage = (idx: number) => {
    const keep = images.filter((_, i) => i !== idx)
    setImages(keep)
    previews.forEach(URL.revokeObjectURL)
    setPreviews(keep.map((f) => URL.createObjectURL(f)))
  }

  const onFieldChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setPricingStatus("idle")
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
  }

  const onSelect = (k: string, v: string) => {
    setPricingStatus("idle")
    setFormData((s) => ({ ...s, [k]: v }))
  }

  const handleEvaluatePrice = async (e: React.FormEvent) => {
    e.preventDefault()
    setPricingStatus("evaluating")

    const res = await evaluateItemPrice({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      brand: formData.brand,
    })

    if (res.success) {
      setEvaluatedPrice(res.price ?? null)
      setPricingStatus("evaluated")
      toast({
        title: "Price Evaluated!",
        description: `We've estimated your item is worth ${res.price} credits.`,
      })
    } else {
      setPricingStatus("manual_fallback")
      toast({
        title: "Automatic pricing unavailable",
        description: res.error,
        variant: "destructive",
      })
    }
  }

  const handleConfirmAndList = async () => {
    if (!currentUser) return
    setIsSubmitting(true)

    let price: number | undefined
    if (pricingStatus === "evaluated" && evaluatedPrice !== null) {
      price = evaluatedPrice
    } else if (pricingStatus === "manual_fallback") {
      price = Number.parseInt(manualPrice, 10) || 0
    }

    if (!price || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please set a valid credit value for the item.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const imgs = await Promise.all(images.map(fileToBase64))
      await listingsService.createListing({
        userId: currentUser.id,
        ...formData,
        price,
        images: imgs,
      })
      toast({
        title: "Success!",
        description: "Your item has been listed.",
        className: "bg-green-100 text-green-800",
      })
      router.push("/my-listings")
    } catch (err) {
      console.error(err)
      toast({
        title: "Listing Failed",
        description: "Could not list your item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---------- UI ----------
  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const isDetailsFormValid = formData.title && formData.description && formData.category && formData.condition

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {step === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Upload Photos</CardTitle>
              <CardDescription>Add up to 5 photos. Good photos increase your chances of a trade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <label className="relative block w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-lg font-medium text-gray-600">Click or drag to upload</span>
                <span className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={formData.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button disabled={images.length === 0} onClick={() => setStep("details")}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "details" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Item Details</CardTitle>
              <CardDescription>Provide the specifics for your item to get a credit valuation.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEvaluatePrice} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={onFieldChange} required autoComplete="off" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onFieldChange}
                    placeholder="Describe your item..."
                    required
                    rows={4}
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
                      onSelect={v => setFormData(s => ({ ...s, category: v }))}
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
                      options={effectiveBrandOptions}
                      value={formData.brand}
                      onSelect={v => setFormData(s => ({ ...s, brand: v }))}
                      placeholder="Brand"
                      allowCustom={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition || ""}
                      onValueChange={v => onSelect("condition", v)}
                      required
                    >
                      <SelectTrigger 
                        className="h-12 w-full rounded-full bg-white px-5 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all hover:bg-[#06402B] hover:border-[#06402B] data-[state=open]:bg-[#06402B] data-[state=open]:border-[#06402B]"
                        style={{ border: '1px solid #d1d5db' }}
                      >
                        <SelectValue placeholder="Condition" className="text-gray-400 data-[placeholder]:text-gray-400" />
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
                    <Input id="size" name="size" value={formData.size} onChange={onFieldChange} />
                  </div>
                </div>

                {/* --- Dynamic Pricing Section --- */}
                {pricingStatus === "evaluated" && evaluatedPrice !== null && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800">Estimated Value</h4>
                    <p className="text-2xl font-bold text-green-600">{evaluatedPrice} Credits</p>
                  </div>
                )}
                {pricingStatus === "manual_fallback" && (
                  <div className="space-y-2">
                    <Label htmlFor="manualPrice">Enter price in credits *</Label>
                    <Input
                      id="manualPrice"
                      type="number"
                      min="1"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      required
                    />
                  </div>
                )}
                {/* --- End Dynamic Pricing Section --- */}

                <div className="flex justify-between items-center pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("upload")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>

                  {pricingStatus === "idle" || pricingStatus === "evaluating" ? (
                    <Button
                      type="submit"
                      className="w-48"
                      disabled={!isDetailsFormValid || pricingStatus === "evaluating"}
                    >
                      {pricingStatus === "evaluating" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {pricingStatus === "evaluating" ? "Evaluating..." : "Evaluate Price"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleConfirmAndList} className="w-48" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Listing..." : "Confirm & List Item"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
