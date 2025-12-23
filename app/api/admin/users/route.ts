import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * GET /api/admin/users
 * Get all users
 */
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || undefined

    const result = await AdminService.getUsers(limit, offset, search)

    return successResponse(result.users, "Users retrieved successfully", {
      total: result.total,
      limit: result.limit,
      hasMore: result.hasMore,
    })
  } catch (error: any) {
    console.error("Get users error:", error)
    return errorResponse(error.message || "Failed to retrieve users", 500)
  }
}

