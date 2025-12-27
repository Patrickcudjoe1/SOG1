import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/app/lib/firebase/admin'
import { getAdminDatabase } from '@/app/lib/firebase/admin'

interface User {
  id: string
  email: string
  name: string
  role?: string
}

export async function GET(req: NextRequest) {
  try {
    // Get Firebase ID token from Authorization header or cookie
    let firebaseToken = req.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!firebaseToken) {
      firebaseToken = req.cookies.get('firebase-id-token')?.value
    }

    if (!firebaseToken) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found'
      })
    }

    // Verify token using Admin SDK
    const decodedToken = await verifyIdToken(firebaseToken)
    if (!decodedToken) {
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid or expired token'
      })
    }

    // Get user from Realtime Database using Admin SDK
    const db = getAdminDatabase()
    const userRef = db.ref(`users/${decodedToken.uid}`)
    const snapshot = await userRef.get()
    
    if (!snapshot.exists()) {
      return NextResponse.json({
        authenticated: false,
        message: 'User not found'
      })
    }

    const user = snapshot.val() as User

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