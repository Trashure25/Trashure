import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await req.json()
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { item: true } } }
  })
  return NextResponse.json(cart)
}
