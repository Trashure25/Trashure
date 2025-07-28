import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma, withRetry, testDatabaseConnection } from '@/lib/prisma'
import type { User } from './auth'

export async function getCurrentUserFromRequest(req: NextRequest): Promise<User | null> {
  try {
    const token = req.cookies.get('trashure_jwt')?.value
    
    if (!token) {
      return null
    }

    // Validate JWT token
    let payload: any
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError)
      return null
    }

    if (!payload || !payload.userId) {
      return null
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(payload.userId)) {
      return null
    }

    // Test database connection first
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      console.error('Database connection failed in getCurrentUserFromRequest')
      return null
    }

    // Fetch user with retry logic
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          trustScore: true,
          createdAt: true,
          updatedAt: true
        }
      })
    })

    if (!user) {
      return null
    }

    return user as User
  } catch (error) {
    console.error('Error in getCurrentUserFromRequest:', error)
    return null
  }
} 