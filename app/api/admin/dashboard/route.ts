import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAdmin(req)
    if (error) return error

    const stats = await AdminService.getDashboardStats()

    return successResponse(stats, "Dashboard statistics retrieved successfully")
  } catch (error: any) {
    console.error("Get dashboard stats error:", error)
    return errorResponse(error.message || "Failed to retrieve dashboard statistics", 500)
  }
}

