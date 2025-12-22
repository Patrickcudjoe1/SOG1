import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * GET /api/admin/orders
 * Get all orders with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status") || undefined
    const paymentStatus = searchParams.get("paymentStatus") || undefined
    const search = searchParams.get("search") || undefined

    const result = await AdminService.getOrders(limit, offset, {
      status,
      paymentStatus,
      search,
    })

    return successResponse(result.orders, "Orders retrieved successfully", {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      hasMore: result.hasMore,
    })
  } catch (error: any) {
    console.error("Get orders error:", error)
    return errorResponse(error.message || "Failed to retrieve orders", 500)
  }
}

