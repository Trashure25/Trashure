"use client"

<<<<<<< HEAD
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronDown, ShoppingCart, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/components/cart-provider"

const NAV_LINKS = [
  { label: "Designers", href: "/designers" },
  { label: "Menswear", href: "/menswear" },
  { label: "Womenswear", href: "/womenswear" },
  { label: "Household & Dorm", href: "/household" },
  { label: "Sneakers", href: "/sneakers" },
]

export function UpdatedAuthNavbar() {
  const { currentUser, isLoading } = useAuth()
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      {/* ---- top bar ---- */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/trashure-icon.jpeg" alt="Trashure icon" width={28} height={28} className="rounded-sm" />
          <Image src="/trashure-logo.png" alt="Trashure" width={100} height={22} priority />
        </Link>

        {/* search */}
        <div className="relative hidden md:block w-full max-w-md px-4">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search…"
            className="w-full bg-gray-100 pl-12 border-0 focus-visible:ring-primary"
          />
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <Link href="/list-item" className="hidden sm:block">
              <Button variant="ghost" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                List Item
              </Button>
            </Link>
          )}

          {/* cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">View cart</span>
            </Button>
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] leading-none flex items-center justify-center"
              >
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* auth */}
          <div className="flex items-center">
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : currentUser ? (
              <Button asChild variant="ghost" className="flex items-center gap-2 px-2 h-10">
                <Link href="/account-settings">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.username} />
                    <AvatarFallback>
                      {currentUser.firstName?.[0]?.toUpperCase()}
                      {currentUser.lastName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">{currentUser.firstName}</span>
                </Link>
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- secondary nav ---- */}
      <nav className="border-t bg-white">
        <div className="container mx-auto flex h-12 items-center justify-center gap-6 overflow-x-auto px-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary whitespace-nowrap flex items-center gap-1"
            >
              {label}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
=======
import { DialogTrigger } from "@/components/ui/dialog"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ChevronDown,
  ShieldCheck,
  LucideX,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  User,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { auth, type SignupData, type LoginData } from "@/lib/auth"
import { payment } from "@/lib/payment"
import { useCart } from "./cart-provider"
import type { User as DatabaseUser } from "@/lib/database"
import { useRouter } from "next/navigation"

const designersData = {
  title: "Shop Popular Designers",
  columns: [
    ["Acne Studios", "Amiri", "Arc'teryx", "Balenciaga", "Bape", "Bottega Veneta", "Carhartt", "Celine"],
    ["Chanel", "Chrome Hearts", "Comme des Garçons", "Dior", "Gucci", "Kapital", "Louis Vuitton"],
    [
      "Maison Margiela",
      "Moncler",
      "Nike",
      "Polo Ralph Lauren",
      "Prada",
      "Raf Simons",
      "Rick Owens",
      "Saint Laurent Paris",
    ],
    ["Stone Island", "Stussy", "Supreme", "Undercover", "Vetements", "Vintage", "Vivienne Westwood", "Yohji Yamamoto"],
  ],
  seeAllLink: "/designers",
}

const menswearData = {
  title: "Shop Menswear By Category",
  columns: [
    {
      title: "Tops",
      items: ["T-Shirts", "Long Sleeve", "Polos", "Shirts", "Sweaters", "Hoodies", "Tank Tops", "Jerseys"],
    },
    { title: "Bottoms", items: ["Casual Pants", "Denim", "Shorts", "Sweatpants", "Swimwear"] },
    { title: "Outerwear", items: ["Light Jackets", "Heavy Coats", "Denim Jackets", "Leather Jackets", "Vests"] },
    { title: "Footwear", items: ["Sneakers", "Boots", "Formal Shoes", "Sandals"] },
    { title: "Accessories", items: ["Bags", "Belts", "Hats", "Jewelry", "Wallets", "Sunglasses"] },
  ],
  seeAllLink: "/menswear",
}

const womenswearData = {
  title: "Shop Womenswear By Category",
  columns: [
    { title: "Tops", items: ["Blouses", "T-Shirts", "Tank Tops", "Sweaters", "Hoodies", "Crop Tops"] },
    { title: "Bottoms", items: ["Pants", "Denim", "Skirts", "Shorts", "Leggings"] },
    { title: "Dresses", items: ["Mini", "Midi", "Maxi", "Gowns"] },
    { title: "Outerwear", items: ["Jackets", "Coats", "Blazers", "Vests"] },
    { title: "Accessories", items: ["Handbags", "Jewelry", "Scarves", "Hats", "Belts", "Sunglasses"] },
  ],
  seeAllLink: "/womenswear",
}

const householdData = {
  title: "Shop Household & Dorm Goods",
  columns: [
    {
      title: "College Dorm Essentials",
      items: ["Mini Fridges", "Microwaves", "Bedding & Linens", "Desk Chairs", "Lamps", "Storage Bins", "Textbooks"],
    },
    { title: "Seating", items: ["Sofas", "Armchairs", "Dining Chairs", "Benches", "Stools"] },
    { title: "Tables", items: ["Coffee Tables", "Dining Tables", "Side Tables", "Desks"] },
    { title: "Decor & Lighting", items: ["Rugs", "Mirrors", "Lamps", "Wall Art", "Plants & Vases"] },
    { title: "Boarding Gear", items: ["Snowboards", "Skateboards", "Surfboards", "Helmets", "Outerwear"] },
  ],
  seeAllLink: "/household",
}

const MegaMenu = ({ trigger, title, columns, seeAllLink, isCategory = false }: any) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="bg-white shadow-lg rounded-md border-gray-200 p-6 w-screen max-w-4xl lg:max-w-6xl"
    >
      <div className="mb-4">
        <p className="font-semibold text-black">{title}</p>
      </div>
      <div
        className={`grid gap-x-8 gap-y-4 ${isCategory ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}
      >
        {isCategory
          ? columns.map((col: any) => (
              <div key={col.title}>
                <h4 className="font-bold text-sm text-black mb-2">{col.title}</h4>
                <ul className="space-y-1">
                  {col.items.map((item: string) => (
                    <li key={item}>
                      <Link href="#" className="text-sm text-gray-600 hover:text-primary hover:underline">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : columns.map((col: string[], colIndex: number) => (
              <ul key={colIndex} className="space-y-1">
                {col.map((item: string) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-primary hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <Link href={seeAllLink} className="text-sm font-semibold text-primary hover:underline">
          SEE ALL {isCategory ? "CATEGORIES" : "DESIGNERS"}
        </Link>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
)

export function UpdatedAuthNavbar() {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login")
  const [showBottomBanner, setShowBottomBanner] = React.useState(true)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = React.useState(false)
  const [isCreditsModalOpen, setIsCreditsModalOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<DatabaseUser | null>(null)

  const { cartCount, refreshCart } = useCart()

  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  })

  React.useEffect(() => {
    let mounted = true

    const checkCurrentUser = async () => {
      try {
        const user = await auth.getCurrentUser()
        if (mounted) {
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("Error checking current user:", error)
        if (mounted) {
          setCurrentUser(null)
        }
      }
    }

    checkCurrentUser()

    return () => {
      mounted = false
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (authError) setAuthError(null)
  }

  const validateForm = () => {
    if (authMode === "signup") {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.username) {
        setAuthError("Please fill in all required fields")
        return false
      }
    } else {
      if (!formData.email || !formData.password) {
        setAuthError("Please fill in all required fields")
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setAuthError("Please enter a valid email address")
      return false
    }

    if (formData.password.length < 6) {
      setAuthError("Password must be at least 6 characters long")
      return false
    }

    if (authMode === "signup" && formData.password !== formData.confirmPassword) {
      setAuthError("Passwords do not match")
      return false
    }

    return true
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setAuthError(null)

    try {
      let result
      if (authMode === "login") {
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password,
        }
        result = await auth.login(loginData)
      } else {
        const signupData: SignupData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
        }
        result = await auth.signup(signupData)
      }

      if (result.success && result.user) {
        if (authMode === "signup") {
          setAuthSuccess("Account created successfully! Please log in with your new credentials.")
          resetAuthModal()
          setTimeout(() => {
            setAuthMode("login")
            setAuthSuccess(null)
          }, 2000)
        } else {
          setCurrentUser(result.user)
          setAuthSuccess("Successfully logged in!")
          resetAuthModal()
          await refreshCart()
          setTimeout(() => {
            setIsAuthModalOpen(false)
            setAuthSuccess(null)
          }, 1500)
        }
      } else {
        setAuthError(result.error || "Authentication failed")
      }
    } catch (error) {
      setAuthError("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    auth.logout()
    setCurrentUser(null)
    refreshCart()
  }

  const handleCreditPurchase = (pkg: any) => {
    if (!currentUser) {
      openAuthModal("login")
      return
    }

    const amountInCents = pkg.dollars * 100
    const totalCredits = pkg.credits + pkg.bonus

    setIsCreditsModalOpen(false)

    router.push(
      `/checkout?amount=${amountInCents}&credits=${totalCredits}&description=Purchase of ${totalCredits} credits`,
    )
  }

  const resetAuthModal = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: "",
    })
    setAuthError(null)
    setAuthSuccess(null)
    setIsLoading(false)
  }

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    resetAuthModal()
    setIsAuthModalOpen(true)
  }

  const creditPackages = payment.getCreditPackages()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/trashure-icon.jpeg" alt="Trashure Icon" width={28} height={28} className="rounded-sm" />
              <Image src="/trashure-wordmark.jpeg" alt="Trashure Logo" width={100} height={20} />
            </Link>

            <div className="flex-1 max-w-xl px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for items, brands, users..."
                  className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary focus:ring-primary"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs bg-gray-50 hover:bg-gray-100 border-gray-300"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentUser ? (
                <>
                  <div className="flex items-center text-sm font-medium text-primary">
                    <span className="mr-2">{currentUser.credits} Credits</span>
                  </div>
                  <Link href="/list-item">
                    <Button
                      variant="outline"
                      className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      LIST ITEM
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent relative"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      CART
                      {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent"
                      >
                        <User className="w-4 h-4 mr-1" />
                        {currentUser.firstName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-listings">My Listings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages">Messages</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsCreditsModalOpen(true)}>Purchase Credits</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsPremiumModalOpen(true)}>Premium</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent"
                    onClick={() => setIsPremiumModalOpen(true)}
                  >
                    PREMIUM
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent"
                    onClick={() => setIsCreditsModalOpen(true)}
                  >
                    PURCHASE CREDITS
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm border-gray-300 hover:border-primary hover:text-primary bg-transparent"
                    onClick={() => openAuthModal("signup")}
                  >
                    SIGN UP
                  </Button>
                  <Button
                    className="text-sm bg-black text-white hover:bg-gray-800"
                    onClick={() => openAuthModal("login")}
                  >
                    LOG IN
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex h-12 items-center justify-start space-x-1 overflow-x-auto">
            <MegaMenu
              trigger={
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-primary px-3 py-2 data-[state=open]:bg-primary/10 data-[state=open]:text-primary"
                >
                  DESIGNERS <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              }
              title={designersData.title}
              columns={designersData.columns}
              seeAllLink={designersData.seeAllLink}
            />
            <MegaMenu
              trigger={
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-primary px-3 py-2 data-[state=open]:bg-primary/10 data-[state=open]:text-primary"
                >
                  MENSWEAR <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              }
              title={menswearData.title}
              columns={menswearData.columns}
              seeAllLink={menswearData.seeAllLink}
              isCategory={true}
            />
            <MegaMenu
              trigger={
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-primary px-3 py-2 data-[state=open]:bg-primary/10 data-[state=open]:text-primary"
                >
                  WOMENSWEAR <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              }
              title={womenswearData.title}
              columns={womenswearData.columns}
              seeAllLink={womenswearData.seeAllLink}
              isCategory={true}
            />
            <MegaMenu
              trigger={
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-primary px-3 py-2 data-[state=open]:bg-primary/10 data-[state=open]:text-primary"
                >
                  HOUSEHOLD & DORM <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              }
              title={householdData.title}
              columns={householdData.columns}
              seeAllLink={householdData.seeAllLink}
              isCategory={true}
            />
            <Link href="/sneakers" className="text-sm font-medium text-black hover:text-primary px-3 py-2">
              SNEAKERS
            </Link>
          </div>
        </div>
      </header>

      <Dialog
        open={isAuthModalOpen}
        onOpenChange={(open) => {
          setIsAuthModalOpen(open)
          if (!open) resetAuthModal()
        }}
      >
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-black">
              {authMode === "login" ? "Log In to Trashure" : "Sign Up for Trashure"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {authMode === "login"
                ? "Access your account and continue your sustainable fashion journey."
                : "Join our community to trade, buy, and sell unique fashion items."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              {authMode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-primary"
                      disabled={isLoading}
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-primary"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Input
                    name="username"
                    placeholder="Username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-primary"
                    disabled={isLoading}
                    required
                  />
                </>
              )}
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
                disabled={isLoading}
                required
              />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary"
                disabled={isLoading}
                required
              />
              {authMode === "signup" && (
                <Input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary"
                  disabled={isLoading}
                  required
                />
              )}
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {authSuccess}
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
              <Button
                type="button"
                variant="link"
                className="text-xs text-primary hover:underline p-0"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login")
                  resetAuthModal()
                }}
                disabled={isLoading}
              >
                {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-deep-green-800 text-white w-full sm:w-auto disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {authMode === "login" ? "Logging In..." : "Signing Up..."}
                  </div>
                ) : authMode === "login" ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-black">Trashure Membership</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Choose the plan that's right for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>The standard Trashure experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">$0.99</span> transaction fee per exchange.
                  </span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Standard shipping rates apply.</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access to millions of unique items.</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                BEST VALUE
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-black">$14.99</span>/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">No transaction fees</span> on all exchanges.
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">Free shipping</span> on all transactions.
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Exclusive access to <span className="font-semibold">designer trades & quality items</span>.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button className="w-full bg-primary hover:bg-deep-green-800 text-white">Upgrade to Premium</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreditsModalOpen} onOpenChange={setIsCreditsModalOpen}>
        <DialogContent className="sm:max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-black">Purchase Credits</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Top up your balance to exchange for amazing items. 1 Credit ≈ $0.10.
              {!currentUser && (
                <span className="block mt-2 text-orange-600 font-medium">Please log in to purchase credits.</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.dollars}
                className={cn(
                  "text-center hover:shadow-lg transition-shadow cursor-pointer",
                  pkg.popular && "border-primary border-2",
                )}
                onClick={() => handleCreditPurchase(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">{pkg.credits + pkg.bonus}</CardTitle>
                  <CardDescription>Credits</CardDescription>
                </CardHeader>
                <CardContent>
                  {pkg.bonus > 0 && <p className="text-xs text-primary font-semibold">+{pkg.bonus} BONUS</p>}
                  <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white pointer-events-none">
                    ${pkg.dollars}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {showBottomBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 z-40 flex items-center justify-center text-sm">
          <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
          <span>Buyer Protection & Authenticity Checks.</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-primary hover:text-deep-green-600 underline ml-2 p-0 h-auto">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-black">Trashure Buyer Protection</DialogTitle>
              </DialogHeader>
              <div className="text-gray-700 space-y-2 text-sm">
                <p>We ensure every transaction is secure and items are authentic.</p>
                <p>Our protection program covers:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Item not as described</li>
                  <li>Item never shipped</li>
                  <li>Authenticity guarantee on select items</li>
                </ul>
                <p>Trade with confidence on Trashure!</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-primary hover:bg-deep-green-800 text-white">Got it!</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-gray-400 hover:text-white p-1"
            onClick={() => setShowBottomBanner(false)}
          >
            <LucideX className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
  )
}
