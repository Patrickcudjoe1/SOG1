import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/app/lib/services/product-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { validateQuery } from "@/app/lib/validation/validate"
import { productFiltersSchema } from "@/app/lib/validation/schemas"
import { applyRateLimit } from "@/app/lib/api/middleware"

/**
 * GET /api/products
 * Get all products with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(req, 100, 60000)
    if (rateLimitResponse) return rateLimitResponse

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)
    const query: Record<string, string | undefined> = {}
    for (const [key, value] of searchParams.entries()) {
      query[key] = value
    }

    const validation = await validateQuery(productFiltersSchema, query)

    if (!validation.success) {
      return validation.response
    }

    const filters = validation.data

    // Get products
    const products = await ProductService.getProducts({
      category: filters.category,
      collection: filters.collection,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      inStock: filters.inStock,
    })

    // Apply pagination
    const offset = filters.offset || 0
    const limit = filters.limit || 20
    const paginatedProducts = products.slice(offset, offset + limit)

    return successResponse(paginatedProducts, "Products retrieved successfully", {
      total: products.length,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + limit < products.length,
    })
  } catch (error: any) {
    console.error("Get products error:", error)
    return errorResponse(error.message || "Failed to retrieve products", 500)
  }
}

