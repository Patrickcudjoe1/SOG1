import { NextRequest, NextResponse } from "next/server"
import { getAdminDatabase } from "@/app/lib/firebase/admin"

/**
 * GET /api/admin/maintenance/status
 * Check current maintenance mode status (public endpoint for debugging)
 */
export async function GET(req: NextRequest) {
  try {
    const db = getAdminDatabase()
    const snapshot = await db.ref('settings/store/maintenanceMode').get()
    const enabled = snapshot.exists() ? snapshot.val() : false

    return NextResponse.json({
      success: true,
      maintenanceMode: enabled,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Check maintenance status error:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to check maintenance status",
        success: false 
      },
      { status: 500 }
    )
  }
}