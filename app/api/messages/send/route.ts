import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { senderId, receiverId, content } = await req.json()
  const message = await prisma.message.create({
    data: { senderId, receiverId, content }
  })
  return NextResponse.json(message)
}
