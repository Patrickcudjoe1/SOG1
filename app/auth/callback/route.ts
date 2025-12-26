import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// OAuth callback route - currently not used as OAuth is disabled
// This can be implemented later if OAuth support is needed
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const redirectTo = requestUrl.searchParams.get('redirect') || '/'

  // Redirect to homepage (or specified redirect)
  return NextResponse.redirect(new URL(redirectTo, request.url))
}

