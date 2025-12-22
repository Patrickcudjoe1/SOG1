import { NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/app/lib/services/order-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth } from "@/app/lib/api/middleware"

/**
 * GET /api/orders/stats
 * Get order statistics
 */
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req)
    if (error) return error

    const stats = await OrderService.getOrderStats(user?.id)

    return successResponse(stats, "Order statistics retrieved successfully")
  } catch (error: any) {
    console.error("Get order stats error:", error)
    return errorResponse(error.message || "Failed to retrieve order statistics", 500)
  }
}

