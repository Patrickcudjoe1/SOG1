import { NextRequest, NextResponse } from "next/server"
import { verifyIdToken } from "./firebase/admin"
import { AdminService } from "./services/admin-service"
import { User } from "./firebase/db"

/**
 * Simple in-memory cache for maintenance mode
 */
let maintenanceModeCache: { enabled: boolean; timestamp: number } | null = null
const CACHE_TTL = 30000 // 30 seconds

/**
 * Check maintenance mode (lightweight for edge runtime)
 */
async function checkMaintenanceMode(request: NextRequest): Promise<boolean> {
  // Check cache first
  if (maintenanceModeCache && Date.now() - maintenanceModeCache.timestamp < CACHE_TTL) {
    return maintenanceModeCache.enabled
  }

  try {
    // Call our API endpoint to check maintenance status
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/admin/maintenance/status`, {
      cache: 'no-store',
    })
    
    if (response.ok) {
      const data = await response.json()
      const enabled = data.maintenanceMode || false
      
      // Update cache
      maintenanceModeCache = { enabled, timestamp: Date.now() }
      
      return enabled
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
  }

  return false // Default to allowing access on error
}

/**
 * Update session middleware for Next.js middleware
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip maintenance check for admin, API, and static files
  const skipMaintenanceCheck = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)

  // Check maintenance mode for public routes
  if (!skipMaintenanceCheck) {
    const isMaintenanceMode = await checkMaintenanceMode(request)
    
    if (isMaintenanceMode && pathname !== '/maintenance') {
      console.log('🚧 Redirecting to maintenance:', pathname)
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
    
    if (!isMaintenanceMode && pathname === '/maintenance') {
      console.log('✅ Redirecting from maintenance to home')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const response = NextResponse.next({
    request,
  })

  // Get Firebase ID token from cookie
  const firebaseToken = request.cookies.get('firebase-id-token')?.value

  let user = null
  if (firebaseToken) {
    const decodedToken = await verifyIdToken(firebaseToken)
    if (decodedToken) {
      user = decodedToken
    }
  }

  // Routes that require authentication
  const protectedRoutes = ['/account', '/checkout']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Routes that should redirect to account if already authenticated
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect to signin if accessing protected route without session
  if (isProtectedRoute && !user) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to account if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return response
}

/**
 * Get authenticated user from request
 */
async function getAuthenticatedUser(req: NextRequest) {
  try {
    console.log('🔐 [AUTH] Getting authenticated user...')
    
    // Get Firebase ID token from Authorization header or cookie
    let firebaseToken = req.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!firebaseToken) {
      firebaseToken = req.cookies.get('firebase-id-token')?.value
    }

    console.log('🔐 [AUTH] Token source:', firebaseToken ? (req.headers.get('Authorization') ? 'Authorization header' : 'Cookie') : 'None')

    if (!firebaseToken) {
      console.log('❌ [AUTH] No authentication token provided')
      return { error: 'No authentication token provided', user: null }
    }

    // Verify token using Admin SDK
    console.log('🔐 [AUTH] Verifying token...')
    const decodedToken = await verifyIdToken(firebaseToken)
    if (!decodedToken) {
      console.log('❌ [AUTH] Token verification failed')
      return { error: 'Invalid or expired token', user: null }
    }

    console.log('✅ [AUTH] Token verified for UID:', decodedToken.uid)

    // Get user from Realtime Database using Admin SDK
    const { getAdminDatabase } = await import('./firebase/admin')
    const db = getAdminDatabase()
    const userRef = db.ref(`users/${decodedToken.uid}`)
    console.log('🔐 [AUTH] Fetching user from database:', decodedToken.uid)
    const snapshot = await userRef.get()
    
    if (!snapshot.exists()) {
      console.log('❌ [AUTH] User not found in database:', decodedToken.uid)
      return { error: 'User not found', user: null }
    }

    const user = snapshot.val() as User
    console.log('✅ [AUTH] User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    return { error: null, user }
  } catch (error: any) {
    console.error('❌ [AUTH] Authentication error:', error)
    return { error: error.message || 'Authentication failed', user: null }
  }
}

/**
 * Require admin middleware for API routes
 */
export async function requireAdmin(req: NextRequest) {
  console.log('🔒 [REQUIRE ADMIN] Checking admin access...')
  
  const { error, user } = await getAuthenticatedUser(req)
  
  if (error || !user) {
    console.log('❌ [REQUIRE ADMIN] Authentication failed:', error)
    return { error: error || 'Authentication required', user: null }
  }

  console.log('✅ [REQUIRE ADMIN] User authenticated, checking admin role...')
  console.log('🔍 [REQUIRE ADMIN] User data:', {
    id: user.id,
    email: user.email,
    role: user.role,
  })

  // Check if user is admin
  const isAdmin = await AdminService.isAdmin(user.id)
  console.log('🔍 [REQUIRE ADMIN] isAdmin check result:', isAdmin)
  
  if (!isAdmin) {
    console.log('❌ [REQUIRE ADMIN] User is not an admin:', {
      userId: user.id,
      userRole: user.role,
    })
    return { error: 'Admin access required', user: null }
  }

  console.log('✅ [REQUIRE ADMIN] Admin access granted')
  return { error: null, user }
}

/**
 * Require super admin middleware for API routes
 */
export async function requireSuperAdmin(req: NextRequest) {
  const { error, user } = await getAuthenticatedUser(req)
  
  if (error || !user) {
    return { error: error || 'Authentication required', user: null }
  }

  // Check if user is super admin
  const isSuperAdmin = await AdminService.isSuperAdmin(user.id)
  if (!isSuperAdmin) {
    return { error: 'Super admin access required', user: null }
  }

  return { error: null, user }
}