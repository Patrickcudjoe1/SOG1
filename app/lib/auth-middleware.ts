import { NextRequest, NextResponse } from "next/server"
import { getSessionFromToken, verifyToken } from "./jwt"
import { adminDB, COLLECTIONS, User } from "./firebase/admin-db"
import { unauthorizedResponse, errorResponse } from "./api/response"

/**
 * Update session middleware for Next.js middleware
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  let user = null
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      user = payload
    }
  }

  // Routes that require authentication
  const protectedRoutes = ['/account', '/checkout']
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Routes that should redirect to homepage if already authenticated
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to signin if accessing protected route without session
  if (isProtectedRoute && !user) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to homepage if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req: NextRequest) {
  try {
    const tokenPayload = await getSessionFromToken()

    if (!tokenPayload) {
      return {
        error: unauthorizedResponse(),
        user: null,
      }
    }

    // Verify user still exists in database
    const user = await adminDB.get<User>(COLLECTIONS.USERS, tokenPayload.userId)

    if (!user) {
      return {
        error: unauthorizedResponse(),
        user: null,
      }
    }

    return {
      error: null,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email?.split("@")[0] || null,
        role: user.role,
      },
    }
  } catch (error) {
    return {
      error: errorResponse("Authentication failed", 500),
      user: null,
    }
  }
}

/**
 * Require admin middleware
 */
export async function requireAdmin(req: NextRequest) {
  const { error, user } = await requireAuth(req)

  if (error) {
    return { error, user: null }
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return {
      error: errorResponse("Admin access required", 403),
      user: null,
    }
  }

  return { error: null, user }
}

/**
 * Require super admin middleware
 */
export async function requireSuperAdmin(req: NextRequest) {
  const { error, user } = await requireAuth(req)

  if (error) {
    return { error, user: null }
  }

  if (!user || user.role !== "SUPER_ADMIN") {
    return {
      error: errorResponse("Super admin access required", 403),
      user: null,
    }
  }

  return { error: null, user }
}

