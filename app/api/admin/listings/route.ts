import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUserFromRequest(request)
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all listings with user details
    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
} 