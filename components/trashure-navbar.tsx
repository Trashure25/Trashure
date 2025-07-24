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
    <header className="navbar sticky-nav flex flex-col bg-white/85 shadow-lg backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/trashure-icon.jpeg" alt="Trashure icon" width={36} height={36} priority />
          <Image src="/trashure-wordmark-final.jpeg" alt="Trashure wordmark" width={160} height={32} />
        </Link>

        {/* Search bar */}
        <div className="flex-1 mx-6 max-w-2xl hidden md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <Input
              type="search"
              placeholder="Search for items, brands, and more..."
              className="h-12 rounded-full bg-white pl-12 shadow-sm border border-gray-200 focus:border-accent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" className="hidden sm:inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold hover:bg-accent/10 hover:text-accent transition-colors">
            <Link href="/list-item">
              <PlusCircle className="h-5 w-5" />
              List Item
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart" className="rounded-full hover:bg-accent/10 hover:text-accent transition-colors">
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
              <Button asChild variant="outline" className="rounded-full px-4 py-2 text-base font-semibold text-black border-gray-300 bg-white hover:bg-accent/10 hover:text-accent">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="rounded-full px-4 py-2 text-base font-semibold text-white bg-accent hover:bg-[#009e7a]">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Secondary Nav */}
      <nav className="flex items-center justify-center gap-8 overflow-x-auto px-6 py-2 text-base font-semibold text-black border-t border-gray-100">
        {navigationItems.map((item) => (
          <div 
            key={item.name} 
            className="relative group"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
              <Link href={item.href} className="hover:text-accent transition-colors">
                {item.name}
              </Link>
              <ChevronDown className="h-3 w-3" />
            </div>
            {/* Hover Dropdown */}
            {hoveredItem === item.name && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] min-w-max animate-fade-in">
                <div className="py-2">
                  {item.subcategories.map((subcategory) => (
                    subcategory.name === "---" ? (
                      <div key="separator" className="h-px bg-gray-200 my-1" />
                    ) : (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block px-5 py-2 text-base text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors whitespace-nowrap rounded-lg"
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
