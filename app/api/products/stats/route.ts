import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/app/lib/services/product-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth } from "@/app/lib/api/middleware"

/**
 * GET /api/products/stats
 * Get product statistics (requires authentication)
 */
export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const { error, user } = await requireAuth(req)
    if (error) return error

    const stats = await ProductService.getProductStats()

    return successResponse(stats, "Product statistics retrieved successfully")
  } catch (error: any) {
    console.error("Get product stats error:", error)
    return errorResponse(error.message || "Failed to retrieve product statistics", 500)
  }
}

