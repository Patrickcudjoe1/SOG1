import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/app/lib/services/product-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { applyRateLimit } from "@/app/lib/api/middleware"

/**
 * GET /api/search
 * Search products
 */
export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(req, 100, 60000)
    if (rateLimitResponse) return rateLimitResponse

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const limit = parseInt(searchParams.get("limit") || "20")

    if (!query) {
      return errorResponse("Search query is required", 400)
    }

    const results = await ProductService.searchProducts(query, limit)

    return successResponse(results, "Search completed successfully", {
      total: results.length,
    })
  } catch (error: any) {
    console.error("Search error:", error)
    return errorResponse(error.message || "Search failed", 500)
  }
}

