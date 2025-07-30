import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserFromRequest } from '@/lib/auth-server'

export const dynamic = 'force-dynamic';

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
    const { action, banReason, trustScore } = await request.json()

    // Validate action
    if (!['ban', 'unban', 'promote', 'demote', 'updateTrustScore'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admin from modifying themselves
    if (user.id === currentUser.id) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'ban':
        updateData = {
          isBanned: true,
          banReason: banReason || 'No reason provided'
        }
        break
      case 'unban':
        updateData = {
          isBanned: false,
          banReason: null
        }
        break
      case 'promote':
        updateData = {
          role: 'admin'
        }
        break
      case 'demote':
        updateData = {
          role: 'user'
        }
        break
      case 'updateTrustScore':
        if (typeof trustScore !== 'number' || trustScore < 0 || trustScore > 100) {
          return NextResponse.json({ error: 'Invalid trust score' }, { status: 400 })
        }
        updateData = {
          trustScore
        }
        break
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ 
      message: `User ${action} successful`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        trustScore: updatedUser.trustScore,
        isBanned: updatedUser.isBanned,
        banReason: updatedUser.banReason
      }
    })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 