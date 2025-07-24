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
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top Row */}
      <div className="flex items-center justify-between px-8 py-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/trashure-wordmark.jpeg" alt="Trashure logo" width={160} height={40} priority />
        </Link>
        {/* Search Bar */}
        <form className="flex-1 flex justify-center">
          <div className="flex w-full max-w-xl border border-black h-12">
            <input
              type="search"
              placeholder="Search for anything"
              className="flex-1 px-5 py-2 text-lg bg-white focus:outline-none"
            />
            <button type="submit" className="px-6 font-bold uppercase border-l border-black bg-white hover:bg-gray-100">Search</button>
          </div>
        </form>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/list-item" className="px-6 h-12 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100">Sell</Link>
          <Link href="/signup" className="px-6 h-12 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100">Sign Up</Link>
          <Link href="/login" className="px-6 h-12 flex items-center justify-center font-bold uppercase bg-black text-white border border-black hover:bg-gray-900">Log In</Link>
        </div>
      </div>
      {/* Second Row: Main Nav */}
      <nav className="flex items-center justify-center gap-12 py-2 border-t border-gray-200">
        {navigationItems.map((item) => (
          <div key={item.name} className="relative group">
            <Link
              href={item.href}
              className="uppercase font-bold tracking-widest text-base text-black px-2 py-1 hover:underline hover:decoration-2 hover:underline-offset-4 transition-colors"
            >
              {item.name}
            </Link>
            {/* Dropdown on hover */}
            {item.subcategories && item.subcategories.length > 0 && hoveredItem === item.name && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 min-w-max bg-white border border-gray-200 z-50 shadow-xl">
                <div className="flex flex-col py-2">
                  {item.subcategories.map((subcategory) => (
                    subcategory.name === "---" ? (
                      <div key="separator" className="h-px bg-gray-200 my-1" />
                    ) : (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block px-6 py-2 text-black text-sm uppercase tracking-wider hover:bg-gray-100 hover:underline hover:decoration-2 hover:underline-offset-4 transition-colors"
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
