// Firebase Admin SDK for server-side auth verification
// NOTE: This requires Firebase Admin SDK which needs service account
// For now, we'll use a simpler approach without Admin SDK

import { auth } from './config'

export interface DecodedToken {
  uid: string
  email?: string
  name?: string
  role?: string
}

// Client-side token verification (simplified)
export async function verifyIdToken(idToken: string): Promise<DecodedToken | null> {
  try {
    // In a production app, you should verify tokens server-side using Admin SDK
    // For this migration, we'll rely on client-side auth state
    const user = auth.currentUser
    if (user) {
      return {
        uid: user.uid,
        email: user.email || undefined,
        name: user.displayName || undefined,
      }
    }
    return null
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Get current authenticated user's token
export async function getCurrentUserToken(): Promise<string | null> {
  try {
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
    return null
  } catch (error) {
    console.error('Get token error:', error)
    return null
  }
}