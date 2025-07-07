"use client"

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
  )
}
