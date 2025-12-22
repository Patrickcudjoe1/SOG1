import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAdmin } from "@/app/lib/api/admin-middleware"

/**
 * GET /api/admin/check
 * Check if user is admin
 */
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAdmin(req)
    if (error) {
      return successResponse({ isAdmin: false }, "User is not an admin")
    }

    const isSuperAdmin = await AdminService.isSuperAdmin(user!.id)

    return successResponse(
      {
        isAdmin: true,
        isSuperAdmin,
        user: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
        },
      },
      "User is an admin"
    )
  } catch (error: any) {
    console.error("Admin check error:", error)
    return errorResponse(error.message || "Failed to check admin status", 500)
  }
}

