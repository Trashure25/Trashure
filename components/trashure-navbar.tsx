"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, PlusCircle, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

function TrashureNavbar() {
  const { currentUser, isLoading } = useAuth()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
  }

  interface NavigationItem {
    name: string
    href: string
    subcategories: Array<{
      name: string
      href: string
      disabled?: boolean
    }>
  }

  const navigationItems: NavigationItem[] = [
    {
      name: "Designers",
      href: "/designers",
      subcategories: [
        { name: "Louis Vuitton", href: "/designers/louis-vuitton" },
        { name: "Dior", href: "/designers/dior" },
        { name: "Bottega Veneta", href: "/designers/bottega-veneta" },
        { name: "Gucci", href: "/designers/gucci" },
        { name: "Prada", href: "/designers/prada" },
        { name: "Saint Laurent", href: "/designers/saint-laurent" },
        { name: "Balenciaga", href: "/designers/balenciaga" },
        { name: "Chanel", href: "/designers/chanel" },
        { name: "Miu Miu", href: "/designers/miu-miu" },
        { name: "Fendi", href: "/designers/fendi" },
        { name: "Celine", href: "/designers/celine" },
        { name: "Off-White", href: "/designers/off-white" },
        { name: "Stussy", href: "/designers/stussy" },
        { name: "Essentials", href: "/designers/essentials" },
        { name: "Fear of God", href: "/designers/fear-of-god" },
        { name: "Aime Leon Dore", href: "/designers/aime-leon-dore" },
        { name: "Supreme", href: "/designers/supreme" },
        { name: "Palace", href: "/designers/palace" },
        { name: "A Bathing Ape", href: "/designers/bape" },
        { name: "Comme des Garçons", href: "/designers/comme-des-garcons" },
        { name: "---", href: "#", disabled: true },
        { name: "Vintage & Archive", href: "/designers/vintage" },
      ]
    },
    {
      name: "Menswear",
      href: "/menswear",
      subcategories: [
        { name: "T-Shirts & Tops", href: "/menswear/tops" },
        { name: "Pants & Jeans", href: "/menswear/pants" },
        { name: "Outerwear", href: "/menswear/outerwear" },
        { name: "Shoes & Boots", href: "/menswear/shoes" },
        { name: "Accessories", href: "/menswear/accessories" },
        { name: "Formal Wear", href: "/menswear/formal" },
      ]
    },
    {
      name: "Womenswear",
      href: "/womenswear",
      subcategories: [
        { name: "Dresses", href: "/womenswear/dresses" },
        { name: "Tops & Blouses", href: "/womenswear/tops" },
        { name: "Pants & Jeans", href: "/womenswear/pants" },
        { name: "Skirts", href: "/womenswear/skirts" },
        { name: "Outerwear", href: "/womenswear/outerwear" },
        { name: "Shoes & Heels", href: "/womenswear/shoes" },
        { name: "Accessories", href: "/womenswear/accessories" },
      ]
    },
    {
      name: "Households & Dorms",
      href: "/household",
      subcategories: [
        { name: "Furniture", href: "/household/furniture" },
        { name: "Kitchen & Dining", href: "/household/kitchen" },
        { name: "Bedding & Bath", href: "/household/bedding" },
        { name: "Decor & Art", href: "/household/decor" },
        { name: "Electronics", href: "/household/electronics" },
        { name: "Storage & Organization", href: "/household/storage" },
      ]
    },
    {
      name: "Sneakers",
      href: "/sneakers",
      subcategories: [
        { name: "Running", href: "/sneakers/running" },
        { name: "Basketball", href: "/sneakers/basketball" },
        { name: "Lifestyle", href: "/sneakers/lifestyle" },
        { name: "Skateboarding", href: "/sneakers/skateboarding" },
        { name: "Limited Edition", href: "/sneakers/limited-edition" },
        { name: "Vintage", href: "/sneakers/vintage" },
      ]
    },
  ]

  return (
    <header className="sticky top-0 z-40 flex flex-col bg-gray-50/95 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/trashure-icon.jpeg" alt="Trashure icon" width={24} height={24} priority />
          <Image src="/trashure-wordmark-final.jpeg" alt="Trashure wordmark" width={120} height={24} />
        </Link>

        {/* Search bar */}
        <div className="flex-1 mx-4 max-w-xl">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
          <Input
            type="search"
            placeholder="Search for items, brands, and more..."
              className="h-10 rounded-md bg-white pl-10"
          />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" className="hidden sm:inline-flex items-center gap-1">
            <Link href="/list-item">
              <PlusCircle className="h-5 w-5" />
              List Item
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6 text-black" />
            </Link>
          </Button>

          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          ) : currentUser ? (
            <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
              <Link href="/account-settings">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={currentUser.avatarUrl || "/placeholder.svg"} alt="User avatar" />
                  <AvatarFallback>{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="outline">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Secondary Nav */}
      <nav className="flex items-center justify-center gap-6 overflow-x-auto px-4 py-1 text-sm font-medium text-black lg:gap-8 border-t border-gray-200">
        {navigationItems.map((item) => (
          <div 
            key={item.name} 
            className="relative group"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center gap-1 hover:text-primary cursor-pointer">
              <Link href={item.href} className="hover:text-primary">
                {item.name}
              </Link>
              <ChevronDown className="h-3 w-3" />
            </div>
            
            {/* Hover Dropdown */}
            {hoveredItem === item.name && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  {item.subcategories.map((subcategory) => (
                    subcategory.name === "---" ? (
                      <div key="separator" className="h-px bg-gray-200 my-1" />
                    ) : (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}

export { TrashureNavbar }
export default TrashureNavbar
