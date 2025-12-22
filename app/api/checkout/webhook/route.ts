import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Find order by Stripe session ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: session.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "COMPLETED",
              status: "PROCESSING",
            },
          });

          // Send order confirmation email
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/orders/${order.id}/send-email`, {
            method: "POST",
          }).catch((err) => console.error("Failed to send email:", err));
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment if needed
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "FAILED",
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

