"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback, useContext } from "react"

import { payment } from "@/lib/payment"
import { useAuth } from "@/contexts/auth-context"

type CartContextType = {
  cartCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0)
  const { currentUser } = useAuth()

  const refreshCart = useCallback(async () => {
    if (currentUser) {
      const cart = await payment.getCart(currentUser.id)
      setCartCount(cart.length)
    } else {
      setCartCount(0)
    }
  }, [currentUser])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return <CartContext.Provider value={{ cartCount, refreshCart }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
