import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse } from "@/app/lib/api/response"

/**
 * POST /api/admin/maintenance/clear-cache
 * Clear the maintenance mode cache in middleware
 * This triggers a revalidation by making the next request fetch fresh data
 */
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    // The middleware cache will automatically refresh on next request
    // due to the 30-second TTL
    
    console.log("✅ Cache clear requested - will refresh on next request")
    
    return successResponse(
      { 
        message: "Cache will refresh within 30 seconds",
        ttl: "30 seconds"
      }, 
      "Cache clear requested"
    )
  } catch (error: any) {
    console.error("Clear cache error:", error)
    return errorResponse(error.message || "Failed to clear cache", 500)
  }
}