import { NextRequest, NextResponse } from 'next/server'
import { adminDB, COLLECTIONS, User } from '@/app/lib/firebase/admin-db'
import { verifyIdToken } from '@/app/lib/firebase/admin'
import { generateToken, setTokenCookie } from '@/app/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, name, uid, idToken } = await req.json()

    console.log('📥 Session sync request:', { email, name, uid })

    if (!email || !uid || !idToken) {
      console.error('❌ Missing email, uid, or idToken')
      return NextResponse.json(
        { error: 'Email, UID, and ID token are required' },
        { status: 400 }
      )
    }

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(idToken)
    if (!decodedToken) {
      console.error('❌ Invalid or expired ID token')
      return NextResponse.json(
        { error: 'Invalid or expired authentication token. Please refresh the page.' },
        { status: 401 }
      )
    }
    
    if (decodedToken.uid !== uid) {
      console.error('❌ Token UID mismatch')
      return NextResponse.json(
        { error: 'Token UID does not match provided UID' },
        { status: 401 }
      )
    }

    // Find or create user in Firebase using Admin SDK
    let user = await adminDB.get<User>(COLLECTIONS.USERS, uid)

    console.log('👤 User found in database:', user ? 'Yes' : 'No')

    if (!user) {
      // Create new user for Firebase authentication
      console.log('➕ Creating new user in database')
      user = await adminDB.create<User>(COLLECTIONS.USERS, uid, {
        email,
        name: name || undefined,
        role: 'USER',
        emailVerified: new Date(),
      })
      console.log('✅ User created:', user.id)
    }

    // Generate JWT token for backend API authentication
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set HTTP-only cookie
    await setTokenCookie(token)
    console.log('🍪 JWT cookie set for user:', user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error: any) {
    console.error('❌ Session sync error:', error)
    
    
    return NextResponse.json(
      { error: 'Failed to sync session' },
      { status: 500 }
    )
  }
}