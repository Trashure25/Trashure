"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, PlusCircle, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRef, useState } from "react"

function TrashureNavbar() {
  const { currentUser, isLoading } = useAuth()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

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
      <div className="flex items-center justify-between px-4 py-1 gap-1 min-h-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <Image src="/trashure-icon.jpeg" alt="Trashure icon" width={24} height={24} priority style={{ background: 'transparent' }} />
          <Image src="/trashure-wordmark.png" alt="Trashure logo" width={80} height={20} priority style={{ background: 'transparent' }} />
        </Link>
        {/* Search Bar */}
        <form className="flex-1 flex justify-center" onSubmit={e => { e.preventDefault(); const q = e.currentTarget.query.value.trim(); if(q) window.location.href = `/search?q=${encodeURIComponent(q)}`; }}>
          <div className="flex w-full max-w-sm border border-black rounded-md overflow-hidden h-9 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#06402B]" />
            </span>
            <input
              name="query"
              type="search"
              placeholder="Search for anything"
              className="flex-1 pl-10 pr-2 py-0.5 text-sm bg-white focus:outline-none focus:ring-0 border-none rounded-none"
              style={{ boxShadow: 'none' }}
            />
            <button type="submit" className="px-4 font-bold uppercase border-l border-black bg-white hover:bg-gray-100 text-xs">Search</button>
          </div>
        </form>
        {/* Actions */}
        <div className="flex items-center gap-1">
          {currentUser ? (
            <>
              <Link href="/list-item" className="px-3 h-8 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100 text-xs">Sell</Link>
              <Link href="/purchase-credits" className="px-3 h-8 flex items-center justify-center font-bold uppercase bg-accent text-white border border-black hover:bg-[#04331f] text-xs ml-1">Purchase Credits</Link>
              <div className="relative ml-2" ref={profileMenuRef}>
                <button
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center bg-white text-black font-bold text-xs focus:outline-none"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl || undefined} alt="User avatar" />
                    <AvatarFallback>{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
                  </Avatar>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                    <Link href="/my-listings" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">My Listings</Link>
                    <Link href="/account-settings" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Account Settings</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Profile</Link>
                    <button
                      onClick={() => { setProfileMenuOpen(false); if (typeof window !== 'undefined') { window.location.href = '/api/auth/logout'; } }}
                      className="block w-full text-left px-4 py-2 text-sm bg-[#950606] text-white rounded-b-lg hover:bg-[#7a0505] mt-2"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/list-item" className="px-3 h-8 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100 text-xs">Sell</Link>
              <Link href="/signup" className="px-3 h-8 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100 text-xs">Sign Up</Link>
              <Link href="/login" className="px-3 h-8 flex items-center justify-center font-bold uppercase bg-accent text-white border border-black hover:bg-[#04331f] text-xs">Log In</Link>
            </>
          )}
        </div>
      </div>
      {/* Second Row: Main Nav */}
      <nav className="flex items-center justify-center gap-6 py-1 border-t border-gray-200 text-xs">
        {navigationItems.map((item) => (
          <div key={item.name} className="relative group">
            <Link
              href={item.href}
              className="uppercase font-bold tracking-widest text-xs text-black px-1 py-0.5 hover:underline hover:decoration-2 hover:underline-offset-4 transition-colors"
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
                        className="block px-6 py-2 text-black text-xs uppercase tracking-wider hover:bg-gray-100 hover:underline hover:decoration-2 hover:underline-offset-4 transition-colors"
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
