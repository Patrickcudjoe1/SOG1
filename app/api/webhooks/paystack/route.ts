import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { firestoreDB, COLLECTIONS, Order } from "@/app/lib/firebase/db"
import { findOrderByPaystackReference } from "@/app/lib/firebase/queries"
import crypto from "crypto"

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

/**
 * Paystack Webhook Handler
 * Verifies webhook signature and processes payment events
 * Prevents duplicate processing with idempotency
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("x-paystack-signature")

    if (!signature || !paystackSecretKey) {
      console.error("Missing Paystack signature or secret key")
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      console.error("Paystack webhook signature verification failed")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    // Handle the event
    switch (event.event) {
      case "charge.success": {
        const data = event.data
        const reference = data.reference

        // Find order by Paystack reference using optimized query
        const order = await findOrderByPaystackReference(reference)

        if (!order) {
          console.error(`Order not found for Paystack reference ${reference}`)
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          )
        }

        // Check if already processed (idempotency)
        if (order.webhookProcessed) {
          console.log(`Order ${order.orderNumber} already processed`)
          return NextResponse.json({ received: true, duplicate: true })
        }

        // Verify payment was successful
        if (data.status === "success" && data.gateway_response === "Successful") {
          // Update order with payment confirmation
          await firestoreDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "COMPLETED",
            status: "PROCESSING",
            webhookProcessed: true,
          })

          // Send order confirmation email (async)
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/orders/${order.id}/send-email`,
            {
              method: "POST",
            }
          ).catch((err) => console.error("Failed to send email:", err))

          console.log(`Order ${order.orderNumber} payment confirmed via Paystack`)
        }

        break
      }

      case "charge.failed": {
        const data = event.data
        const reference = data.reference

        // Find order by Paystack reference using optimized query
        const order = await findOrderByPaystackReference(reference)

        if (order) {
          await firestoreDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "FAILED",
            status: "CANCELLED",
          })

          console.log(`Order ${order.orderNumber} payment failed via Paystack`)
        }

        break
      }

      default:
        console.log(`Unhandled Paystack event type: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Paystack webhook processing error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// Disable body parsing, we need raw body for signature verification
export const runtime = "nodejs"