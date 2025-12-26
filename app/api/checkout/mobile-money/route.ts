import { NextRequest, NextResponse } from "next/server";
import { getSessionFromToken } from "@/app/lib/jwt";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/db/prisma";
import { 
  generateIdempotencyKey, 
  sanitizeAmount, 
  validateEmail,
  validateGhanaPhone,
  formatGhanaPhone 
} from "@/app/lib/payment-utils";

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SOG-${timestamp}-${random}`;
}

// Generate transaction ID for mobile money
function generateTransactionId(): string {
  return `MM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    // Get user session if authenticated (guest checkout is allowed)
    const tokenPayload = await getSessionFromToken();
    const userId = tokenPayload?.userId || null;
    
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
      mobileMoneyPhone,
      mobileMoneyProvider,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shipping || !shipping.email || !shipping.fullName) {
      return NextResponse.json({ error: "Shipping information is required" }, { status: 400 });
    }

    if (!mobileMoneyPhone || !mobileMoneyProvider) {
      return NextResponse.json({ error: "Mobile money information is required" }, { status: 400 });
    }

    if (!validateEmail(shipping.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!validateGhanaPhone(mobileMoneyPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

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

    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey();

    // Check for duplicate order
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

    const cleanPhone = formatGhanaPhone(mobileMoneyPhone);

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Create shipping address first
    const shippingAddress = await prisma.address.create({
      data: {
        userId: userId,
        fullName: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone || null,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2 || null,
        city: shipping.city,
        region: shipping.region || null,
        postalCode: shipping.postalCode,
        country: shipping.country || "Ghana",
        isDefault: false,
      },
    });

    // Create order in database (before payment)
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId,
        email: shipping.email,
        phone: shipping.phone || null,
        status: OrderStatus.PENDING,
        subtotal: sanitizedSubtotal,
        shippingCost: sanitizedShippingCost,
        discountAmount: sanitizedDiscount,
        totalAmount: sanitizedTotal,
        promoCode: promoCode || null,
        paymentMethod: "mobile_money",
        paymentStatus: PaymentStatus.PENDING, // Will be updated when payment is confirmed via webhook
        mobileMoneyTransactionId: transactionId,
        mobileMoneyProvider,
        mobileMoneyPhone: cleanPhone,
        deliveryMethod: deliveryMethod || null,
        idempotencyKey,
        shippingAddressId: shippingAddress.id,
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
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    // Increment promo code usage if applicable
    if (promoCode) {
      await prisma.promoCode.update({
        where: { code: promoCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {
        // Ignore if promo code doesn't exist
      });
    }

    // Note: Payment confirmation will be handled via webhook
    // For Paystack integration, use /api/checkout/paystack instead
    // This endpoint is kept for backward compatibility
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      transactionId,
      message: "Order created. Payment will be confirmed via webhook.",
      // In production, redirect to payment gateway or return payment URL
    });
  } catch (error: any) {
    console.error("Mobile money checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process mobile money payment" },
      { status: 500 }
    );
  }
}

