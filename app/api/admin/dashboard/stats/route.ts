import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// GET /api/admin/dashboard/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Test database connection
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Calculate date for recent reports (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get all statistics with retry logic
    const [
      totalUsers,
      totalReports,
      pendingReports,
      bannedUsers,
      recentReports
    ] = await withRetry(async () => {
      const [
        totalUsersResult,
        totalReportsResult,
        pendingReportsResult,
        bannedUsersResult,
        recentReportsResult
      ] = await Promise.all([
        prisma.user.count(),
        prisma.report.count(),
        prisma.report.count({ where: { status: 'pending' } }),
        prisma.user.count({ where: { isBanned: true } }),
        prisma.report.count({
          where: {
            createdAt: {
              gte: sevenDaysAgo
            }
          }
        })
      ])
      
      return [
        totalUsersResult,
        totalReportsResult,
        pendingReportsResult,
        bannedUsersResult,
        recentReportsResult
      ]
    })

    return NextResponse.json({
      totalUsers,
      totalReports,
      pendingReports,
      bannedUsers,
      recentReports
    })
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
} 