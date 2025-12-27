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
    console.log('🔍 [ADMIN CHECK] Starting admin check...')
    console.log('🔍 [ADMIN CHECK] Request headers:', {
      authorization: req.headers.get('Authorization') ? 'Present' : 'Missing',
      cookie: req.cookies.get('firebase-id-token') ? 'Present' : 'Missing',
    })

    const { error, user } = await requireAdmin(req)
    
    console.log('🔍 [ADMIN CHECK] requireAdmin result:', {
      error,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
    })

    if (error) {
      console.log('❌ [ADMIN CHECK] Admin check failed:', error)
      return successResponse({ isAdmin: false }, "User is not an admin")
    }

    console.log('✅ [ADMIN CHECK] User authenticated:', {
      id: user!.id,
      email: user!.email,
      role: user!.role,
    })

    // Double-check admin status
    const isAdminCheck = await AdminService.isAdmin(user!.id)
    console.log('🔍 [ADMIN CHECK] AdminService.isAdmin result:', isAdminCheck)

    const isSuperAdmin = await AdminService.isSuperAdmin(user!.id)
    console.log('🔍 [ADMIN CHECK] AdminService.isSuperAdmin result:', isSuperAdmin)

    console.log('✅ [ADMIN CHECK] Final result:', {
      isAdmin: true,
      isSuperAdmin,
      user: {
        id: user!.id,
        email: user!.email,
        role: user!.role,
      },
    })

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
    console.error("❌ [ADMIN CHECK] Unexpected error:", error)
    return errorResponse(error.message || "Failed to check admin status", 500)
  }
}