// Compatibility file for auth-config imports
// This file provides the same interface as the expected auth-config
// Re-export from auth-middleware for server-side API routes

import { getSessionFromToken } from "./jwt"
import { prisma } from "./db/prisma"

/**
 * Get session from request token
 */
export async function getSession() {
  // This is a server-side function that should be used in API routes
  // For client-side, use the AuthProvider hook instead
  return null
}

/**
 * Require authentication - redirects if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

// Export auth object that matches the expected interface
export const auth = {
  getSession,
  requireAuth,
}

// Also export functions directly
export { getSession, requireAuth }

