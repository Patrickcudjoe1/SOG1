import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * GET /api/admin/analytics?period=30d
 * Get analytics data with chart data for selected period
 */
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    // Get period from query params
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30d'

    const stats = await AdminService.getAnalytics(period)

    return successResponse(stats, "Analytics data retrieved successfully")
  } catch (error: any) {
    console.error("Get analytics error:", error)
    return errorResponse(error.message || "Failed to retrieve analytics data", 500)
  }
}