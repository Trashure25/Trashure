"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function TrashureNavbar() {
  const { currentUser, isLoading } = useAuth()

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
  }

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
          <Input
            type="search"
            placeholder="Search for items, brands, and more..."
            className="h-10 rounded-md bg-white"
          />
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
        <Link href="/designers" className="hover:text-primary shrink-0">
          Designers
        </Link>
        <Link href="/menswear" className="hover:text-primary shrink-0">
          Menswear
        </Link>
        <Link href="/womenswear" className="hover:text-primary shrink-0">
          Womenswear
        </Link>
        <Link href="/household" className="hover:text-primary shrink-0">
          Households &amp; Dorms
        </Link>
        <Link href="/sneakers" className="hover:text-primary shrink-0">
          Sneakers
        </Link>
      </nav>
    </header>
  )
}

export { TrashureNavbar }
export default TrashureNavbar
