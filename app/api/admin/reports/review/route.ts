import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

// POST /api/admin/reports/review - Review a report (admin only)
export async function POST(request: NextRequest) {
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

    const { reportId, action, adminNotes, banUser, banReason } = await request.json()

    // Validate input
    if (!reportId || !action) {
      return NextResponse.json(
        { error: 'Report ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'dismiss'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    if (banUser && !banReason) {
      return NextResponse.json(
        { error: 'Ban reason is required when banning user' },
        { status: 400 }
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

    // Get the report
    const report = await withRetry(async () => {
      return await prisma.report.findUnique({
        where: { id: reportId },
        include: {
          reported: {
            select: {
              id: true,
              trustScore: true
            }
          }
        }
      })
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    if (report.status !== 'pending') {
      return NextResponse.json(
        { error: 'Report has already been reviewed' },
        { status: 400 }
      )
    }

    // Update report status
    const newStatus = action === 'approve' ? 'resolved' : 'dismissed'
    
    await withRetry(async () => {
      return await prisma.report.update({
        where: { id: reportId },
        data: {
          status: newStatus,
          adminNotes: adminNotes || null,
          reviewedBy: user.id,
          reviewedAt: new Date()
        }
      })
    })

    // If approving and banning user, ban the reported user
    if (action === 'approve' && banUser) {
      await withRetry(async () => {
        return await prisma.user.update({
          where: { id: report.reportedId },
          data: {
            isBanned: true,
            banReason: banReason
          }
        })
      })
    }

    // If approving, apply trust score penalty
    if (action === 'approve') {
      // Calculate penalty based on recent reports
      const recentReports = await withRetry(async () => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        return await prisma.report.count({
          where: {
            reportedId: report.reportedId,
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        })
      })

      const totalReports = await withRetry(async () => {
        return await prisma.report.count({
          where: { reportedId: report.reportedId }
        })
      })

      // Calculate penalty (5 points per report + 10 points per recent report)
      const penalty = Math.min(totalReports * 5 + recentReports * 10, 50)
      
      await withRetry(async () => {
        return await prisma.user.update({
          where: { id: report.reportedId },
          data: {
            trustScore: {
              decrement: penalty
            }
          }
        })
      })
    }

    return NextResponse.json({
      success: true,
      message: `Report ${action === 'approve' ? 'approved' : 'dismissed'} successfully`
    })
  } catch (error) {
    console.error('Error reviewing report:', error)
    return NextResponse.json(
      { error: 'Failed to review report' },
      { status: 500 }
    )
  }
} 