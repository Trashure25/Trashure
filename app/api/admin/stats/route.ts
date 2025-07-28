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

    // Fetch platform statistics
    const [
      totalUsers,
      totalListings,
      activeListings,
      bannedUsers,
      totalReports,
      pendingReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'pending' } })
    ])

    const stats = {
      totalUsers,
      totalListings,
      activeListings,
      bannedUsers,
      totalReports,
      pendingReports
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 