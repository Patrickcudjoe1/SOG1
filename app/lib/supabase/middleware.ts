import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '../jwt'

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

  // Routes that should redirect to account if already authenticated
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to signin if accessing protected route without session
  if (isProtectedRoute && !user) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to account if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return response
}

