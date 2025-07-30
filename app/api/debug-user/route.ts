import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(request)
    
    if (!currentUser) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Not authenticated'
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
        isBanned: currentUser.isBanned,
        trustScore: currentUser.trustScore
      },
      isAdmin: currentUser.role === 'admin',
      message: `User role: ${currentUser.role}`
    })
  } catch (error) {
    console.error('Error in debug-user:', error)
    return NextResponse.json({ 
      authenticated: false,
      error: 'Failed to get user info'
    })
  }
} 