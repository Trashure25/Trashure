"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { CreditCard } from "lucide-react"
import { NavbarSearch } from "@/components/navbar-search"

function TrashureNavbar() {
  const { currentUser, logout, reloadUser, isLoading } = useAuth()
  const router = useRouter()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname();

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

  // Add effect to close profile menu on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
        <NavbarSearch />
        {/* Email Verification Banner */}
        {currentUser && !currentUser.emailVerified && (
          <div className="absolute top-full left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-800">
              <span>⚠️ Please verify your email address to access all features</span>
              <button 
                onClick={async () => {
                  try {
                    await fetch('/api/auth/send-verification-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: currentUser.email })
                    });
                    alert('Verification email sent! Check your inbox.');
                  } catch (error) {
                    alert('Failed to send verification email. Please try again.');
                  }
                }}
                className="text-yellow-600 hover:text-yellow-800 underline text-xs"
              >
                Resend
              </button>
            </div>
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center gap-1">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : currentUser ? (
            <>
              <Link href="/list-item" className="px-3 h-8 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100 text-xs">List Item</Link>
              <div className="flex items-center gap-1 ml-1">
                <div className="px-2 h-8 flex items-center justify-center text-xs bg-green-50 border border-green-200 text-green-700 rounded">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {currentUser.credits || 0}
                </div>
                <Link href="/purchase-credits" className="px-3 h-8 flex items-center justify-center font-bold uppercase bg-accent text-white border border-black hover:bg-[#04331f] text-xs">Purchase Credits</Link>
              </div>
              <Link 
                href="/messages" 
                className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center bg-white text-black hover:bg-gray-50 transition-colors ml-2"
                title="Messages"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
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
                    <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Profile</Link>
                    {currentUser.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium">Admin Dashboard</Link>
                    )}
                    <Link href="/messages" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">My Messages</Link>
                    <Link href="/favorites" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">My Favorites</Link>
                    <Link href="/my-listings" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">My Listings</Link>
                    <Link href="/account-settings" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Account Settings</Link>
                    <button
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        try {
                          await logout();
                          router.push('/');
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className="mx-auto mt-3 px-4 py-2 bg-[#950606] text-white rounded-md font-bold text-sm hover:bg-[#7a0505] block"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/list-item" className="px-3 h-8 flex items-center justify-center font-bold uppercase border border-black bg-white text-black hover:bg-gray-100 text-xs">List Item</Link>
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
              onClick={() => setProfileMenuOpen(false)}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                setHoveredItem(item.name)
              }}
              onMouseLeave={() => {
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredItem(null)
                }, 150) // Small delay to allow moving to dropdown
              }}
            >
              {item.name}
            </Link>
            {/* Dropdown on hover */}
            {item.subcategories && item.subcategories.length > 0 && hoveredItem === item.name && (
              <div 
                className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 z-50 shadow-xl rounded-sm"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                    hoverTimeoutRef.current = null
                  }
                  setHoveredItem(item.name)
                }}
                onMouseLeave={() => {
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredItem(null)
                  }, 150) // Small delay to allow moving back to nav item
                }}
              >
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
