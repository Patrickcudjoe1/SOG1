import { NextRequest, NextResponse } from "next/server"

// Re-export from auth-middleware for backward compatibility
export { requireAuth, requireAdmin, requireSuperAdmin } from "../auth-middleware"

/**
 * Rate limiting helper (simple in-memory version)
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })

    // Clean up old records
    if (rateLimitMap.size > 10000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) {
          rateLimitMap.delete(k)
        }
      }
    }

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    }
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Apply rate limiting to request
 */
export function applyRateLimit(
  req: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  const identifier =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"

  const result = rateLimit(identifier, maxRequests, windowMs)

  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetTime.toString(),
        },
      }
    )
  }

  return null
}

/**
 * CORS headers helper
 */
export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_BASE_URL || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

/**
 * Handle CORS preflight
 */
export function handleCORS(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders() })
  }
  return null
}

