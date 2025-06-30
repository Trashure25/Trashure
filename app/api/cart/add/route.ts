import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId, itemId, quantity } = await req.json()
  // Find or create cart for user
  let cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } })
  }
  // Add or update cart item
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, itemId } })
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + (quantity || 1) } })
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, itemId, quantity: quantity || 1 } })
  }
  return NextResponse.json({ success: true })
}
