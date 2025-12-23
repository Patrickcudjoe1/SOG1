import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/app/lib/services/order-service";
import { successResponse, errorResponse } from "@/app/lib/api/response";
import { requireAuth } from "@/app/lib/api/middleware";

export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req);
    if (error) return error;

    if (!user?.id) {
      return errorResponse("User ID not found", 401);
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await OrderService.getUserOrders(user.id, limit, offset);

    return successResponse(result.orders, "Orders retrieved successfully", {
      total: result.total,
      limit: result.limit,
      hasMore: result.hasMore,
    });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return errorResponse(error.message || "Failed to fetch orders", 500);
  }
}

