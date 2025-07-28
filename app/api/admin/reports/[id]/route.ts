import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUserFromRequest(request)
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { status, adminNotes, reviewedBy } = await request.json()

    // Validate status
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date()
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        reported: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // If report is resolved, decrease reported user's trust score
    if (status === 'resolved') {
      await prisma.user.update({
        where: { id: report.reportedId },
        data: {
          trustScore: {
            decrement: 10 // Decrease trust score by 10 points
          }
        }
      })
    }

    return NextResponse.json({ 
      message: 'Report updated successfully',
      report: updatedReport
    })
  } catch (error) {
    console.error('Failed to update report:', error)
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
} 