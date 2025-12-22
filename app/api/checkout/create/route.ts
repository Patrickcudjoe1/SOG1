import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-config";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { generateIdempotencyKey, sanitizeAmount, validateEmail } from "@/app/lib/payment-utils";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SOG-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      items,
      shipping,
      deliveryMethod,
      subtotal,
      shippingCost,
      discount,
      total,
      promoCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shipping || !shipping.email || !shipping.fullName) {
      return NextResponse.json({ error: "Shipping information is required" }, { status: 400 });
    }

    // Validate email format
    if (!validateEmail(shipping.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Generate idempotency key to prevent duplicate payments
    const idempotencyKey = generateIdempotencyKey();

    // Check for duplicate order with same idempotency key
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
    });

    if (existingOrder) {
      return NextResponse.json(
        { 
          error: "Duplicate payment detected",
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
        },
        { status: 409 }
      );
    }

    // Sanitize amounts
    const sanitizedSubtotal = sanitizeAmount(validatedSubtotal);
    const sanitizedShippingCost = sanitizeAmount(shippingCost);
    const sanitizedDiscount = sanitizeAmount(discount);
    const sanitizedTotal = sanitizeAmount(sanitizedSubtotal + sanitizedShippingCost - sanitizedDiscount);

    // Server-side cart validation before processing
    const { validateCartItems } = await import("@/app/lib/cart-validation")
    const validationResult = await validateCartItems(items)

    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          error: "Cart validation failed", 
          details: validationResult.errors 
        },
        { status: 400 }
      );
    }

    // Use validated items with corrected prices/quantities
    const validatedItems = validationResult.validatedItems || items;
    const validatedSubtotal = validationResult.correctedSubtotal || subtotal;

    // Create order in database first (before payment)
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        email: shipping.email,
        phone: shipping.phone,
        status: "PENDING",
        subtotal: sanitizedSubtotal,
        shippingCost: sanitizedShippingCost,
        discountAmount: sanitizedDiscount,
        totalAmount: sanitizedTotal,
        promoCode: promoCode || null,
        paymentMethod: "card",
        paymentStatus: "PENDING",
        deliveryMethod,
        idempotencyKey,
        items: {
          create: validatedItems.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
        },
        shippingAddress: {
          create: {
            userId: session?.user?.id || null,
            fullName: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            addressLine1: shipping.addressLine1,
            addressLine2: shipping.addressLine2 || null,
            city: shipping.city,
            region: shipping.region || null,
            postalCode: shipping.postalCode,
            country: shipping.country || "Ghana",
            isDefault: false,
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    // Create Stripe checkout session with validated items
    const lineItems = validatedItems.map((item: any) => ({
      price_data: {
        currency: "ghs",
        product_data: {
          name: item.name,
          images: item.image ? [new URL(item.image, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").href] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to pesewas
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "ghs",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Add discount if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: "ghs",
          product_data: {
            name: "Discount",
          },
          unit_amount: -Math.round(discount * 100), // Negative amount for discount
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout?canceled=true`,
      customer_email: shipping.email,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        idempotencyKey,
      },
      // Idempotency key for Stripe
      idempotency_key: idempotencyKey,
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        stripeSessionId: checkoutSession.id,
        stripePaymentIntentId: checkoutSession.payment_intent as string || null,
      },
    });

    // Increment promo code usage if applicable
    if (promoCode) {
      await prisma.promoCode.update({
        where: { code: promoCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

