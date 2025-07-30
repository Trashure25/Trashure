import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// GET /api/reports/check - Check if user has reported another user
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

    const { searchParams } = new URL(request.url)
    const reporterId = searchParams.get('reporterId')
    const reportedId = searchParams.get('reportedId')

    // Validate input
    if (!reporterId || !reportedId) {
      return NextResponse.json(
        { error: 'Reporter ID and reported ID are required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(reporterId) || !uuidRegex.test(reportedId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
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

    // Check if report exists
    const report = await withRetry(async () => {
      return await prisma.report.findUnique({
        where: {
          reporterId_reportedId: {
            reporterId: reporterId,
            reportedId: reportedId
          }
        }
      })
    })

    return NextResponse.json({
      hasReported: !!report,
      reportId: report?.id || null
    })
  } catch (error) {
    console.error('Error checking report:', error)
    return NextResponse.json(
      { error: 'Failed to check report' },
      { status: 500 }
    )
  }
} 