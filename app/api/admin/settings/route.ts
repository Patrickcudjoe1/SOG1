import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { getAdminDatabase } from "@/app/lib/firebase/admin"

const SETTINGS_PATH = "settings/store"

interface StoreSettings {
  storeEmail?: string
  notificationEmail?: string
  enableEmailNotifications?: boolean
  maintenanceMode?: boolean
  updatedAt?: string
}

/**
 * GET /api/admin/settings
 * Get store settings
 */
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    const db = getAdminDatabase()
    const settingsRef = db.ref(SETTINGS_PATH)
    const snapshot = await settingsRef.get()

    const settings: StoreSettings = snapshot.exists() 
      ? snapshot.val() 
      : {
          storeEmail: "",
          notificationEmail: "",
          enableEmailNotifications: true,
          maintenanceMode: false,
        }

    return successResponse(settings, "Settings retrieved successfully")
  } catch (error: any) {
    console.error("Get settings error:", error)
    return errorResponse(error.message || "Failed to retrieve settings", 500)
  }
}

/**
 * PUT /api/admin/settings
 * Update store settings
 */
export async function PUT(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    const body = await req.json()
    const db = getAdminDatabase()
    const settingsRef = db.ref(SETTINGS_PATH)

    const settings: StoreSettings = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    await settingsRef.set(settings)

    console.log("✅ Store settings updated:", settings)

    return successResponse(settings, "Settings updated successfully")
  } catch (error: any) {
    console.error("Update settings error:", error)
    return errorResponse(error.message || "Failed to update settings", 500)
  }
}