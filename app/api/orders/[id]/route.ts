import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/app/lib/services/order-service";
import { successResponse, notFoundResponse, errorResponse } from "@/app/lib/api/response";
import { requireAuth } from "@/app/lib/api/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth(req);
    if (error) return error;

    const { id } = await params;
    const order = await OrderService.getOrderById(id, user?.id);

    if (!order) {
      return notFoundResponse("Order");
    }

    return successResponse(order, "Order retrieved successfully");
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return errorResponse(error.message || "Failed to fetch order", 500);
  }
}

