import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth, verifyIdToken } from '@/app/lib/firebase/admin'
import { z } from 'zod'

const signinSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = signinSchema.parse(body)

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(validatedData.idToken)

    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user details from Firebase
    const adminAuth = getAdminAuth()
    const firebaseUser = await adminAuth.getUser(decodedToken.uid)

    // Create response with user info
    const response = NextResponse.json({
      success: true,
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || null,
      },
    })

    // Store the ID token in a cookie for session management
    response.cookies.set('firebase-id-token', validatedData.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in. Please try again.' },
      { status: 500 }
    )
  }
}

