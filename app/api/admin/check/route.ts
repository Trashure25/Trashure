import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

// GET /api/admin/check - Check if user is admin
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
    const isAdmin = user.role === 'admin' || user.role === 'moderator'

    return NextResponse.json({
      isAdmin,
      role: user.role
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
} 