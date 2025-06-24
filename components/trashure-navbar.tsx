"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, ShieldCheck, LucideX, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { cn } from "@/lib/utils"

// Data objects
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
const creditPackages = [
  { dollars: 5, credits: 50, bonus: 0, popular: false },
  { dollars: 20, credits: 200, bonus: 25, popular: true },
  { dollars: 50, credits: 500, bonus: 100, popular: false },
  { dollars: 100, credits: 1000, bonus: 250, popular: false },
  { dollars: 500, credits: 5000, bonus: 700, popular: false },
  { dollars: 1000, credits: 10000, bonus: 1200, popular: false },
]

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

export function TrashureNavbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login")
  const [showBottomBanner, setShowBottomBanner] = React.useState(true)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = React.useState(false)
  const [isCreditsModalOpen, setIsCreditsModalOpen] = React.useState(false)

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

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
              <Button
                variant="outline"
                className="text-sm border-gray-300 hover:border-primary hover:text-primary"
                onClick={() => setIsPremiumModalOpen(true)}
              >
                PREMIUM
              </Button>
              <Button
                variant="outline"
                className="text-sm border-gray-300 hover:border-primary hover:text-primary"
                onClick={() => setIsCreditsModalOpen(true)}
              >
                PURCHASE CREDITS
              </Button>
              <Button variant="outline" className="text-sm border-gray-300 hover:border-primary hover:text-primary">
                EXCHANGE
              </Button>
              <Button
                variant="outline"
                className="text-sm border-gray-300 hover:border-primary hover:text-primary"
                onClick={() => openAuthModal("signup")}
              >
                SIGN UP
              </Button>
              <Button className="text-sm bg-black text-white hover:bg-gray-800" onClick={() => openAuthModal("login")}>
                LOG IN
              </Button>
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

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
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
          <div className="grid gap-4 py-4">
            <Input placeholder="Email" type="email" className="border-gray-300 focus:border-primary" />
            <Input placeholder="Password" type="password" className="border-gray-300 focus:border-primary" />
            {authMode === "signup" && (
              <Input placeholder="Confirm Password" type="password" className="border-gray-300 focus:border-primary" />
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
            <Button
              variant="link"
              className="text-xs text-primary hover:underline p-0"
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
            >
              {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </Button>
            <DialogClose asChild>
              <Button type="submit" className="bg-primary hover:bg-deep-green-800 text-white w-full sm:w-auto">
                {authMode === "login" ? "Log In" : "Sign Up"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Premium Modal */}
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

      {/* Purchase Credits Modal */}
      <Dialog open={isCreditsModalOpen} onOpenChange={setIsCreditsModalOpen}>
        <DialogContent className="sm:max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-black">Purchase Credits</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Top up your balance to exchange for amazing items. 1 Credit ≈ $0.10.
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
                  <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white">${pkg.dollars}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Banner */}
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
  )
}
