import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/app/lib/services/product-service"
import { successResponse, notFoundResponse, errorResponse } from "@/app/lib/api/response"
import { applyRateLimit } from "@/app/lib/api/middleware"

/**
 * GET /api/products/[id]
 * Get product by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(req, 100, 60000)
    if (rateLimitResponse) return rateLimitResponse

    const { id } = await params
    const product = await ProductService.getProductById(id)

    if (!product) {
      return notFoundResponse("Product")
    }

    return successResponse(product, "Product retrieved successfully")
  } catch (error: any) {
    console.error("Get product error:", error)
    return errorResponse(error.message || "Failed to retrieve product", 500)
  }
}

