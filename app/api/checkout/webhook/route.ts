import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { firestoreDB, COLLECTIONS, Order } from "@/app/lib/firebase/db";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Create a Stripe instance for webhook verification
    // Note: The API key is not used for webhook verification, only the webhook secret is needed
    // But we need an instance to call the constructEvent method
    const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_for_webhook_verification";
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-12-15.clover",
    });
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
        const orders = await firestoreDB.getMany<Order>(
          COLLECTIONS.ORDERS,
          { orderBy: "stripeSessionId", equalTo: session.id, limitToFirst: 1 }
        );

        if (orders.length > 0) {
          const order = orders[0];
          // Check if already processed (idempotency)
          if (order.webhookProcessed) {
            return NextResponse.json({ received: true, message: "Already processed" });
          }

          await firestoreDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "COMPLETED",
            status: "PROCESSING",
            webhookProcessed: true,
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
        const orders = await firestoreDB.getMany<Order>(
          COLLECTIONS.ORDERS,
          { orderBy: "stripePaymentIntentId", equalTo: paymentIntent.id, limitToFirst: 1 }
        );

        if (orders.length > 0) {
          const order = orders[0];
          await firestoreDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
            paymentStatus: "FAILED",
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

