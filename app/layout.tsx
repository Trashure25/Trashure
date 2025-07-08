import type React from "react"
import type { Metadata } from "next"
<<<<<<< HEAD
import { Inter, Oswald } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/components/cart-provider"
import { UpdatedAuthNavbar } from "@/components/updated-auth-navbar"
import { TrashureFooter } from "@/components/trashure-footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })

export const metadata: Metadata = {
  title: "Trashure - Peer-to-Peer Fashion Exchange",
  description: "Trade, buy, and sell unique fashion items, from streetwear to vintage classics.",
=======
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Trashure - Peer-to-Peer Fashion Exchange",
  description: "Make your trash treasure. The leading platform for trading fashion and goods.",
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, oswald.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <UpdatedAuthNavbar />
              <main>{children}</main>
              <TrashureFooter />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
=======
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
      </body>
    </html>
  )
}
