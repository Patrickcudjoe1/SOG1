import { NextRequest, NextResponse } from "next/server"
import { adminDB, COLLECTIONS, Order } from "@/app/lib/firebase/admin-db"

/**
 * Verify payment status for an order
 * Used to check payment status after redirect from payment gateway
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("orderId")
    const sessionId = searchParams.get("session_id")
    const reference = searchParams.get("reference")

    if (!orderId && !sessionId && !reference) {
      return NextResponse.json(
        { error: "Order ID, session ID, or reference is required" },
        { status: 400 }
      )
    }

    let order: Order | null = null

    if (orderId) {
      order = await adminDB.get<Order>(COLLECTIONS.ORDERS, orderId)
    } else if (sessionId) {
      const orders = await adminDB.getMany<Order>(
        COLLECTIONS.ORDERS,
        { orderBy: "stripeSessionId", equalTo: sessionId, limitToFirst: 1 }
      )
      order = orders[0] || null
    } else if (reference) {
      const orders = await adminDB.getMany<Order>(
        COLLECTIONS.ORDERS,
        { orderBy: "paystackReference", equalTo: reference, limitToFirst: 1 }
      )
      order = orders[0] || null
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      totalAmount: order.totalAmount,
      paid: order.paymentStatus === "COMPLETED",
    })
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    )
  }
}
