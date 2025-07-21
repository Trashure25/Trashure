import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/components/cart-provider"
import { TrashureNavbar } from "@/components/trashure-navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata = {
  title: "Trashure",
  description: "The leading global platform for peer-to-peer luxury, streetwear, and vintage fashion and goods.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <AuthProvider>
          <CartProvider>
            <TrashureNavbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
