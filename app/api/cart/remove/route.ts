import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId, itemId } = await req.json()
  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  const cartItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, itemId } })
  if (!cartItem) return NextResponse.json({ error: 'Item not in cart' }, { status: 404 })
  await prisma.cartItem.delete({ where: { id: cartItem.id } })
  return NextResponse.json({ success: true })
} 