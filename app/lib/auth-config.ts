// Compatibility file for auth-config imports
// This file provides the same interface as the expected auth-config
// Used by API routes that import from @/app/lib/auth-config
// Uses Firebase Admin SDK for server-side authentication

import { NextRequest } from "next/server"
import { getAdminAuth, verifyIdToken } from "./firebase/admin"
import { cookies } from "next/headers"

/**
 * Get session from Firebase token (server-side)
 */
export async function getSession() {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("firebase-token")?.value || 
                  cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    // Verify token using Firebase Admin
    const decodedToken = await verifyIdToken(token)
    
    if (!decodedToken) {
      return null
    }

    // Get user details from Firebase Admin
    const adminAuth = getAdminAuth()
    const userRecord = await adminAuth.getUser(decodedToken.uid)

    return {
      user: {
        id: userRecord.uid,
        email: userRecord.email || "",
        name: userRecord.displayName || userRecord.email?.split("@")[0] || null,
        role: (userRecord.customClaims?.role as string) || "USER",
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

// Export auth object that matches the expected interface
// API routes import { auth } from "@/app/lib/auth-config"
export const auth = {
  getSession,
  requireAuth,
}

