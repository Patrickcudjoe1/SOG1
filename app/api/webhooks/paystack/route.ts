import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import { adminDB, COLLECTIONS, Order } from "@/app/lib/firebase/admin-db"
import { findOrderByPaystackReferenceAdmin } from "@/app/lib/firebase/admin-queries"

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

/**
 * Paystack Webhook Handler
 * - Verifies webhook signature
 * - Updates order payment status
 * - Ensures idempotency
 * - Triggers email after successful payment
 */
export async function POST(req: NextRequest) {
  try {
    // IMPORTANT: Use raw body for signature verification
    const body = await req.text()

    // ✅ CORRECT WAY TO READ HEADERS IN APP ROUTER API ROUTES
    const signature =
      req.headers.get("x-paystack-signature") ||
      req.headers.get("X-Paystack-Signature")

    if (!signature || !paystackSecretKey) {
      console.error("❌ Missing Paystack signature or secret key", {
        hasSignature: !!signature,
        hasSecretKey: !!paystackSecretKey,
      })

      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      )
    }

    // 🔐 Verify Paystack webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      console.error("❌ Invalid Paystack webhook signature")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Parse verified event
    const event = JSON.parse(body)

    switch (event.event) {
      /**
       * ✅ PAYMENT SUCCESS
       */
      case "charge.success": {
        const data = event.data
        const reference = data.reference

        // Find order by Paystack reference (using admin SDK to bypass auth)
        const order = await findOrderByPaystackReferenceAdmin(reference)

        if (!order) {
          console.error(`❌ Order not found for Paystack reference: ${reference}`)
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          )
        }

        // 🛑 Idempotency check (prevents double processing)
        if (order.webhookProcessed && order.paymentStatus === "COMPLETED") {
          console.log(
            `⚠️ Webhook already processed for order ${order.orderNumber}`
          )
          return NextResponse.json({
            received: true,
            duplicate: true,
          })
        }

        // Confirm payment success
        if (
          data.status === "success" &&
          data.gateway_response === "Successful"
        ) {
          const now = new Date().toISOString()

          // ✅ UPDATE ORDER (THIS WAS NOT RUNNING BEFORE)
          await adminDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "COMPLETED",
            status: "PROCESSING",
            paidAt: now,
            webhookProcessed: true,
            updatedAt: now,
          })

          console.log(`✅ Payment COMPLETED for order ${order.orderNumber}`)
          console.log(`   Reference: ${reference}`)
          console.log(`   Amount: ₵${order.totalAmount}`)

          // 📧 Trigger email sending (async, non-blocking)
          fetch(
            `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/api/orders/${order.id}/send-email`,
            { method: "POST" }
          ).catch((err) =>
            console.error("❌ Failed to trigger email sending:", err)
          )
        }

        break
      }

      /**
       * ❌ PAYMENT FAILED
       */
      case "charge.failed": {
        const data = event.data
        const reference = data.reference

        const order = await findOrderByPaystackReferenceAdmin(reference)

        if (order) {
          await adminDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "FAILED",
            status: "CANCELLED",
            updatedAt: new Date().toISOString(),
          })

          console.log(`❌ Payment FAILED for order ${order.orderNumber}`)
        }

        break
      }

      default:
        console.log(`ℹ️ Unhandled Paystack event: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("🔥 Paystack webhook error:", error)

    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// IMPORTANT: Required so Paystack signature verification works
export const runtime = "nodejs"
