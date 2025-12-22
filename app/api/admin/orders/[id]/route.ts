import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, notFoundResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * PATCH /api/admin/orders/[id]
 * Update order status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!status) {
      return errorResponse("Status is required", 400)
    }

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]
    if (!validStatuses.includes(status)) {
      return errorResponse("Invalid status", 400)
    }

    const order = await AdminService.updateOrderStatus(id, status)

    return successResponse(order, "Order status updated successfully")
  } catch (error: any) {
    console.error("Update order status error:", error)
    return errorResponse(error.message || "Failed to update order status", 500)
  }
}

