import { NextRequest, NextResponse } from "next/server";
import { getSessionFromToken } from "@/app/lib/jwt";
import { firestoreDB, COLLECTIONS, Order, Address, OrderItem, PromoCode } from "@/app/lib/firebase/db";
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
      console.error("Cart validation failed:", validationResult.errors)
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
    const existingOrders = await firestoreDB.getMany<Order>(
      COLLECTIONS.ORDERS,
      { orderBy: "idempotencyKey", equalTo: idempotencyKey, limitToFirst: 1 }
    );

    if (existingOrders.length > 0) {
      const existingOrder = existingOrders[0];
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
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shippingAddress = await firestoreDB.create<Address>(COLLECTIONS.ADDRESSES, addressId, {
      userId: userId || undefined,
      fullName: shipping.fullName,
      email: shipping.email,
      phone: shipping.phone || undefined,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2 || undefined,
      city: shipping.city,
      region: shipping.region || undefined,
      postalCode: shipping.postalCode,
      country: shipping.country || "Ghana",
      isDefault: false,
    });

    // Create order in database (before payment)
    const orderNumber = generateOrderNumber();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order items
    const orderItems: OrderItem[] = validatedItems.map((item: any, index: number) => ({
      id: `item_${orderId}_${index}`,
      orderId,
      productId: item.productId || item.id,
      productName: item.name,
      productImage: item.image || undefined,
      price: item.price,
      quantity: item.quantity,
      size: item.size || undefined,
      color: item.color || undefined,
      createdAt: new Date(),
    }));

    const order = await firestoreDB.create<Order>(COLLECTIONS.ORDERS, orderId, {
      orderNumber,
      userId: userId || undefined,
      email: shipping.email,
      phone: shipping.phone || undefined,
      status: 'PENDING',
      subtotal: sanitizedSubtotal,
      shippingCost: sanitizedShippingCost,
      discountAmount: sanitizedDiscount,
      totalAmount: sanitizedTotal,
      promoCode: promoCode || undefined,
      paymentMethod: "mobile_money",
      paymentStatus: 'PENDING',
      mobileMoneyTransactionId: transactionId,
      mobileMoneyProvider,
      mobileMoneyPhone: cleanPhone,
      deliveryMethod: deliveryMethod || undefined,
      idempotencyKey,
      shippingAddressId: addressId,
      shippingAddress,
      webhookProcessed: false,
      items: orderItems,
    });

    // Increment promo code usage if applicable (ATOMIC)
    if (promoCode) {
      try {
        const promos = await firestoreDB.getMany<PromoCode>(
          COLLECTIONS.PROMO_CODES,
          { orderBy: "code", equalTo: promoCode.toUpperCase(), limitToFirst: 1 }
        );
        if (promos.length > 0) {
          const promo = promos[0];
          // Use Firebase transaction for atomic increment
          const { database } = await import("@/app/lib/firebase/config");
          const { ref, runTransaction } = await import("firebase/database");
          
          const promoRef = ref(database, `${COLLECTIONS.PROMO_CODES}/${promo.id}/usedCount`);
          await runTransaction(promoRef, (currentCount) => {
            return (currentCount || 0) + 1;
          });
        }
      } catch (error) {
        console.error('Failed to increment promo code usage:', error);
        // Don't fail the order if promo increment fails
      }
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

