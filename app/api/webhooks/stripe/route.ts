import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Stripe Webhook Handler
 * Verifies webhook signature and processes payment events
 * Prevents duplicate processing with idempotency
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret")
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Check if already processed (idempotency)
        const existingOrder = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
            webhookProcessed: true,
          },
        })

        if (existingOrder) {
          console.log(`Order ${existingOrder.orderNumber} already processed`)
          return NextResponse.json({ received: true, duplicate: true })
        }

        // Find order by session ID
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        })

        if (!order) {
          console.error(`Order not found for session ${session.id}`)
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          )
        }

        // Verify payment was successful
        if (session.payment_status === "paid") {
          // Update order with payment confirmation
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "COMPLETED",
              status: "PROCESSING",
              stripePaymentIntentId: session.payment_intent as string,
              webhookProcessed: true,
            },
          })

          // Send order confirmation email (async)
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/orders/${order.id}/send-email`, {
            method: "POST",
          }).catch((err) => console.error("Failed to send email:", err))

          console.log(`Order ${order.orderNumber} payment confirmed`)
        }

        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })

        if (order && !order.webhookProcessed) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "COMPLETED",
              status: "PROCESSING",
              webhookProcessed: true,
            },
          })

          console.log(`Order ${order.orderNumber} payment confirmed via payment_intent`)
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        const order = await prisma.order.findFirst({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "FAILED",
              status: "CANCELLED",
            },
          })

          console.log(`Order ${order.orderNumber} payment failed`)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// Disable body parsing, we need raw body for signature verification
export const runtime = "nodejs"

