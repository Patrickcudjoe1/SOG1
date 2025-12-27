import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, notFoundResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { getAdminDatabase } from "@/app/lib/firebase/admin"
import { COLLECTIONS, Order } from "@/app/lib/firebase/db"

/**
 * GET /api/admin/orders/[id]
 * Get order details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    const { id } = await params
    const db = getAdminDatabase()
    const orderRef = db.ref(`${COLLECTIONS.ORDERS}/${id}`)
    const snapshot = await orderRef.get()

    if (!snapshot.exists()) {
      return notFoundResponse("Order")
    }

    const order = snapshot.val() as Order

    return successResponse(order, "Order retrieved successfully")
  } catch (error: any) {
    console.error("Get order error:", error)
    return errorResponse(error.message || "Failed to get order", 500)
  }
}

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
    if (error) {
      return errorResponse(error, 401)
    }

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