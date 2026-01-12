import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
})

// Lazy import to prevent initialization errors from breaking the route
async function getFirebaseAdmin() {
  try {
    const { getAdminAuth, verifyIdToken } = await import('@/app/lib/firebase/admin')
    return { getAdminAuth, verifyIdToken }
  } catch (error) {
    console.error('❌ Failed to import Firebase Admin:', error)
    throw new Error('Firebase Admin SDK not available')
  }
}

async function getDatabaseService() {
  try {
    const { UserService } = await import('@/app/lib/services/user-service')
    return { UserService }
  } catch (error) {
    console.error('❌ Failed to import UserService:', error)
    throw new Error('UserService not available')
  }
}

export async function POST(req: NextRequest) {
  try {
    // Lazy load Firebase Admin and UserService
    const { getAdminAuth, verifyIdToken } = await getFirebaseAdmin()
    const { UserService } = await getDatabaseService()

    const body = await req.json()
    const validatedData = signupSchema.parse(body)

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(validatedData.idToken)

    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user details from Firebase Auth
    const adminAuth = getAdminAuth()
    const firebaseUser = await adminAuth.getUser(decodedToken.uid)

    // Check if user already exists in database
    let dbUser = await UserService.getUserById(firebaseUser.uid)

    // If user doesn't exist in database, create them
    if (!dbUser) {
      console.log('📝 Creating new user in database:', firebaseUser.uid)
      dbUser = await UserService.createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        image: firebaseUser.photoURL || undefined,
      })
      console.log('✅ User created in database:', dbUser.id)
    } else {
      console.log('✅ User already exists in database:', dbUser.id)
    }

    // Create response with user info
    const response = NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
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

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}

