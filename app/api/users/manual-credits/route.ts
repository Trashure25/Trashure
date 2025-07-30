import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { manualCredits } = await req.json()

    if (typeof manualCredits !== 'number' || manualCredits < 0 || manualCredits > 10000) {
      return NextResponse.json({ error: 'Invalid manual credits amount. Must be between 0 and 10,000.' }, { status: 400 })
    }

    // Update user's manual credits
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { manualCredits },
      select: {
        id: true,
        credits: true,
        manualCredits: true,
        username: true,
        email: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating manual credits:', error)
    return NextResponse.json(
      { error: 'Failed to update manual credits' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        credits: true,
        manualCredits: true,
        username: true,
        email: true,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching manual credits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch manual credits' },
      { status: 500 }
    )
  }
} 