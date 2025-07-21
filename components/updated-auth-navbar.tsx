"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

export function UpdatedAuthNavbar() {
  const { currentUser, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex flex-col bg-gray-50 shadow-sm">
      {/* ---- Primary row ---- */}
      <div className="flex items-center justify-between px-4 py-2 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/trashure-logo.png" alt="Trashure icon" width={32} height={32} priority />
          <span className="font-oswald text-xl tracking-wide text-black">TRASHURE</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 mx-4 max-w-xl">
          <Input type="search" placeholder="Search..." className="h-10 rounded-md bg-white" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/list-item" className="inline-flex items-center gap-1 font-medium text-black hover:underline">
            <PlusCircle className="h-5 w-5" />
            List Item
          </Link>
          <Link href="/cart" aria-label="Cart">
            <ShoppingCart className="h-6 w-6 text-black" />
          </Link>

          {/* Avatar / auth */}
          {currentUser ? (
            <button
              onClick={logout}
              className="h-8 w-8 rounded-full bg-primary text-white text-xs font-bold"
              title="Log out"
            >
              {currentUser.initials}
            </button>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="secondary">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ---- Secondary row (categories) ---- */}
      <nav className="flex items-center justify-center gap-6 px-4 py-1 text-sm font-medium text-black lg:gap-8">
        <Link href="/designers" className="hover:text-primary">
          Designers
        </Link>
        <Link href="/menswear" className="hover:text-primary">
          Menswear
        </Link>
        <Link href="/womenswear" className="hover:text-primary">
          Womenswear
        </Link>
        <Link href="/household" className="hover:text-primary">
          Household &amp; Dorm
        </Link>
        <Link href="/sneakers" className="hover:text-primary">
          Sneakers
        </Link>
      </nav>
    </header>
  )
}
