import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId, brandName, name, price, description, age, condition, imageUrl } = await req.json()
  // Find or create brand
  let brand = await prisma.brand.findUnique({ where: { name: brandName } })
  if (!brand) {
    brand = await prisma.brand.create({ data: { name: brandName } })
  }
  // Create item
  const item = await prisma.item.create({
    data: {
      userId,
      brandId: brand.id,
      name,
      price,
      description,
      age,
      condition,
      imageUrl,
      verified: false,
      listedAt: new Date(),
    }
  })
  return NextResponse.json(item)
}
