import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

// POST /api/reports - Create a new report
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

    const { reportedId, reason, description } = await request.json()

    // Validate input
    if (!reportedId || !reason) {
      return NextResponse.json(
        { error: 'Reported user ID and reason are required' },
        { status: 400 }
      )
    }

    // Prevent self-reporting
    if (user.id === reportedId) {
      return NextResponse.json(
        { error: 'Cannot report yourself' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(reportedId)) {
      return NextResponse.json(
        { error: 'Invalid reported user ID format' },
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

    // Check if user being reported exists
    const reportedUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: reportedId },
        select: { id: true }
      })
    })

    if (!reportedUser) {
      return NextResponse.json(
        { error: 'User being reported not found' },
        { status: 404 }
      )
    }

    // Check if report already exists
    const existingReport = await withRetry(async () => {
      return await prisma.report.findUnique({
        where: {
          reporterId_reportedId: {
            reporterId: user.id,
            reportedId: reportedId
          }
        }
      })
    })

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this user' },
        { status: 409 }
      )
    }

    // Create report
    const report = await withRetry(async () => {
      return await prisma.report.create({
        data: {
          reporterId: user.id,
          reportedId: reportedId,
          reason: reason,
          description: description || null
        },
        include: {
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true
            }
          },
          reported: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true
            }
          }
        }
      })
    })

    // Calculate and update trust score penalty
    const recentReports = await withRetry(async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      return await prisma.report.count({
        where: {
          reportedId: reportedId,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    })

    const totalReports = await withRetry(async () => {
      return await prisma.report.count({
        where: { reportedId: reportedId }
      })
    })

    // Calculate penalty (5 points per report + 10 points per recent report)
    const penalty = Math.min(totalReports * 5 + recentReports * 10, 50)
    
    // Update trust score
    await withRetry(async () => {
      return await prisma.user.update({
        where: { id: reportedId },
        data: {
          trustScore: {
            decrement: penalty
          }
        }
      })
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

// GET /api/reports - Get reports for a user
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
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
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

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch reports
    const [reports, totalCount] = await withRetry(async () => {
      const [reportsResult, countResult] = await Promise.all([
        prisma.report.findMany({
          where: {
            reporterId: userId
          },
          include: {
            reporter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true
              }
            },
            reported: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.report.count({
          where: { reporterId: userId }
        })
      ])
      
      return [reportsResult, countResult]
    })

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
} 