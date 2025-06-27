import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.json()
  const { email, password, displayName, handle, phone } = data

  if (!email || !password || !displayName || !handle) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        handle,
        phone,
      },
    })
    return NextResponse.json({ user })
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Unique constraint failed
      return NextResponse.json({ error: 'Email or handle already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Sign up failed.' }, { status: 500 })
  }
} 