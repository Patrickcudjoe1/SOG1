import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signinSchema = z.object({
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

export async function POST(req: NextRequest) {
  try {
    // Lazy load Firebase Admin
    const { getAdminAuth, verifyIdToken } = await getFirebaseAdmin()
    
    // Check if Firebase Admin is initialized
    try {
      getAdminAuth()
    } catch (adminError: any) {
      console.error('❌ Firebase Admin not initialized:', adminError.message)
      return NextResponse.json(
        { error: 'Server configuration error. Please check Firebase Admin credentials.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const validatedData = signinSchema.parse(body)

    // Validate token format
    if (!validatedData.idToken || validatedData.idToken.trim() === '') {
      console.error('❌ Empty token received')
      return NextResponse.json(
        { error: 'Invalid token: Token is empty' },
        { status: 401 }
      )
    }

    console.log('🔐 Verifying token (length:', validatedData.idToken.length, ')')

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(validatedData.idToken)

    if (!decodedToken) {
      console.error('❌ Token verification failed')
      return NextResponse.json(
        { error: 'Invalid or expired token. Please try logging in again.' },
        { status: 401 }
      )
    }

    console.log('✅ Token verified for user:', decodedToken.uid)

    // Get user details from Firebase Auth
    const adminAuth = getAdminAuth()
    const firebaseUser = await adminAuth.getUser(decodedToken.uid)

    // Get or create user in database
    let dbUser
    try {
      const { UserService } = await import('@/app/lib/services/user-service')
      dbUser = await UserService.getUserById(firebaseUser.uid)
      
      // If user doesn't exist in database, create them (for existing Firebase users)
      if (!dbUser) {
        console.log('📝 Creating user in database for existing Firebase user:', firebaseUser.uid)
        dbUser = await UserService.createUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          image: firebaseUser.photoURL || undefined,
        })
      }
    } catch (dbError: any) {
      console.warn('⚠️ Database error, using Firebase user data:', dbError.message)
      // Fallback to Firebase user data if database fails
      dbUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'USER' as const,
      }
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

    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in. Please try again.' },
      { status: 500 }
    )
  }
}

