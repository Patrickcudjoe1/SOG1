import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Protected routes that require authentication will be handled client-side
  // by the AuthProvider and useAuth hook
  // This middleware just ensures proper routing

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}