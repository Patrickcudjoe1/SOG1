import { NextRequest, NextResponse } from "next/server"
import { adminDB, COLLECTIONS } from "@/app/lib/firebase/admin-db"

/**
 * DEBUG ENDPOINT: Verify and manually update payment status
 * Use this temporarily to check order status and manually mark as paid if needed
 * Remove this endpoint after webhook is properly configured
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    // Get order
    const order = await adminDB.get(COLLECTIONS.ORDERS, orderId)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check Paystack payment status
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: "Paystack not configured" },
        { status: 500 }
      )
    }

    if (!order.paystackReference) {
      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          status: order.status,
          paystackReference: null,
        },
        message: "No Paystack reference found - payment not initiated",
      })
    }

    // Verify transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${order.paystackReference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    const verifyData = await verifyResponse.json()

    if (!verifyData.status) {
      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          status: order.status,
          paystackReference: order.paystackReference,
        },
        paystackStatus: "error",
        message: verifyData.message,
      })
    }

    const paystackPayment = verifyData.data

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
        webhookProcessed: order.webhookProcessed,
        paidAt: order.paidAt,
        paystackReference: order.paystackReference,
      },
      paystack: {
        status: paystackPayment.status,
        gateway_response: paystackPayment.gateway_response,
        paid_at: paystackPayment.paid_at,
        amount: paystackPayment.amount / 100, // Convert from kobo to cedis
      },
      analysis: {
        paystackSaysSuccess: paystackPayment.status === "success",
        ourRecordSaysCompleted: order.paymentStatus === "COMPLETED",
        webhookProcessed: order.webhookProcessed === true,
        mismatch: paystackPayment.status === "success" && order.paymentStatus !== "COMPLETED",
      },
    })
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    )
  }
}

/**
 * POST: Manually mark payment as completed (for testing/debugging only)
 * Remove this after webhook is working
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    // Get order
    const order = await adminDB.get(COLLECTIONS.ORDERS, orderId)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    if (order.paymentStatus === "COMPLETED") {
      return NextResponse.json({
        message: "Order is already marked as completed",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
        },
      })
    }

    // Verify with Paystack first
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    
    if (!paystackSecretKey || !order.paystackReference) {
      return NextResponse.json(
        { error: "Cannot verify payment - missing Paystack data" },
        { status: 400 }
      )
    }

    // Verify transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${order.paystackReference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { 
          error: "Payment not successful in Paystack",
          paystackStatus: verifyData.data?.status,
        },
        { status: 400 }
      )
    }

    // Update order
    await adminDB.update(COLLECTIONS.ORDERS, orderId, {
      paymentStatus: "COMPLETED",
      status: "PROCESSING",
      paidAt: new Date().toISOString(),
      webhookProcessed: true,
    })

    console.log(`✅ Manually marked order ${order.orderNumber} as COMPLETED`)

    return NextResponse.json({
      success: true,
      message: "Payment status updated to COMPLETED",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: "COMPLETED",
        status: "PROCESSING",
      },
    })
  } catch (error: any) {
    console.error("Manual payment update error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update payment status" },
      { status: 500 }
    )
  }
}