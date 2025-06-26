import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.json()
  const { email, password, displayName, handle } = data

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName,
      handle,
      // ...other fields
    },
  })

  return NextResponse.json({ user })
} 