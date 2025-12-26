import { NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { firestoreDB, COLLECTIONS } from "@/app/lib/firebase/db"

/**
 * Firebase health check
 */
async function healthCheck() {
  try {
    // Test Firestore connection by attempting to count users
    await firestoreDB.count(COLLECTIONS.USERS, [])
    return { healthy: true }
  } catch (error: any) {
    console.error("Firebase health check failed:", error)
    return { healthy: false, error: error.message }
  }
}

/**
 * GET /api/health
 * Health check endpoint
 */
export async function GET(req: NextRequest) {
  try {
    const dbHealth = await healthCheck()

    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbHealth.healthy ? "connected" : "disconnected",
      databaseType: "Firebase Firestore",
      ...(dbHealth.error && { databaseError: dbHealth.error }),
    }

    if (!dbHealth.healthy) {
      return errorResponse("Database connection failed", 503)
    }

    return successResponse(health, "Service is healthy")
  } catch (error: any) {
    console.error("Health check error:", error)
    return errorResponse("Health check failed", 500)
  }
}