import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase, Database } from 'firebase-admin/database'

let adminApp: App | null = null
let adminAuth: ReturnType<typeof getAuth> | null = null
let adminDatabase: Database | null = null

// Initialize Firebase Admin SDK
export function getAdminApp(): App {
  if (adminApp) {
    return adminApp
  }

  try {
    // Check if already initialized
    const existingApps = getApps()
    if (existingApps.length > 0) {
      adminApp = existingApps[0]
      return adminApp
    }

    // Validate environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials. Check .env.local file.')
    }

    console.log('🔧 Initializing Firebase Admin SDK...')
    console.log('Project ID:', projectId)
    console.log('Client Email:', clientEmail?.substring(0, 20) + '...')
    console.log('Private Key:', privateKey ? '✅ Present' : '❌ Missing')
    console.log('Database URL:', databaseURL)

    // Initialize with environment variables (no service account file needed)
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      databaseURL,
    })

    console.log('✅ Firebase Admin SDK initialized successfully')
    return adminApp
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error)
    throw error
  }
}

// Get Admin Auth
export function getAdminAuth() {
  if (!adminAuth) {
    const app = getAdminApp()
    adminAuth = getAuth(app)
  }
  return adminAuth
}

// Get Admin Database
export function getAdminDatabase(): Database {
  if (!adminDatabase) {
    const app = getAdminApp()
    adminDatabase = getDatabase(app)
  }
  return adminDatabase
}

// Verify ID token
export async function verifyIdToken(idToken: string) {
  try {
    const auth = getAdminAuth()
    // Don't check revoked to avoid strict token expiration
    const decodedToken = await auth.verifyIdToken(idToken, false)
    console.log('✅ Token verified successfully for user:', decodedToken.uid)
    return decodedToken
  } catch (error: any) {
    // Provide more specific error messages
    if (error.code === 'auth/id-token-expired') {
      console.error('❌ Token expired - client needs to refresh token')
    } else if (error.code === 'auth/argument-error') {
      console.error('❌ Invalid token format')
    } else {
      console.error('❌ Token verification error:', error.code || error.message)
    }
    return null
  }
}