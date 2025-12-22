import { NextRequest, NextResponse } from "next/server"
import { healthCheck } from "@/app/lib/db/prisma"
import { successResponse, errorResponse } from "@/app/lib/api/response"

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

