/**
 * Centralized authentication utilities
 * Manages all auth-related redirects and navigation
 */

/**
 * Redirect after successful authentication
 * Default is homepage, NOT /account
 */
export function redirectAfterAuth(callbackUrl?: string | null) {
  const destination = callbackUrl && callbackUrl !== '/signin' && callbackUrl !== '/signup' 
    ? callbackUrl 
    : '/'
  
  return destination
}

/**
 * Check if user should be redirected away from auth pages
 */
export function shouldRedirectFromAuthPage(user: any, isShowingModal: boolean): boolean {
  return user !== null && !isShowingModal
}

/**
 * Get redirect destination for protected routes
 */
export function getProtectedRouteRedirect(currentPath: string): string {
  return `/signin?callbackUrl=${encodeURIComponent(currentPath)}`
}