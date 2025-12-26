import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromToken } from '@/app/lib/jwt'
import { firestoreDB, COLLECTIONS, User } from '@/app/lib/firebase/db'

export async function GET(req: NextRequest) {
  try {
    const tokenPayload = await getSessionFromToken()

    if (!tokenPayload) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found'
      })
    }

    // Verify user exists
    const user = await firestoreDB.get<User>(COLLECTIONS.USERS, tokenPayload.userId)

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'User not found'
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Session valid'
    })
  } catch (error: any) {
    console.error('Session check error:', error)
    return NextResponse.json({
      authenticated: false,
      message: 'Session check failed',
      error: error.message
    }, { status: 500 })
  }
}