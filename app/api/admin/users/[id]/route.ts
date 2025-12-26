import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { successResponse, notFoundResponse, errorResponse } from "@/app/lib/api/response"
import { requireSuperAdmin } from "@/app/lib/api/admin-middleware"
import { UserRole } from "@/app/lib/firebase/db"

// Valid user roles
const VALID_ROLES: UserRole[] = ['USER', 'ADMIN', 'SUPER_ADMIN']

/**
 * PATCH /api/admin/users/[id]
 * Update user role
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireSuperAdmin(req)
    if (error) return error

    const { id } = await params
    const body = await req.json()
    const { role } = body

    if (!role || !VALID_ROLES.includes(role)) {
      return errorResponse("Invalid role", 400)
    }

    const user = await AdminService.updateUserRole(id, role as UserRole)

    return successResponse(user, "User role updated successfully")
  } catch (error: any) {
    console.error("Update user role error:", error)
    return errorResponse(error.message || "Failed to update user role", 500)
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireSuperAdmin(req)
    if (error) return error

    const { id } = await params
    await AdminService.deleteUser(id)

    return successResponse(null, "User deleted successfully")
  } catch (error: any) {
    console.error("Delete user error:", error)
    return errorResponse(error.message || "Failed to delete user", 500)
  }
}

