import { NextRequest, NextResponse } from "next/server"
import { getSessionFromToken } from "@/app/lib/jwt"
import { adminDB, COLLECTIONS, Order, Address, OrderItem, PromoCode } from "@/app/lib/firebase/admin-db"
import { 
  validateCartItems 
} from "@/app/lib/cart-validation"
import { 
  generateIdempotencyKey, 
  sanitizeAmount, 
  validateEmail,
  validateGhanaPhone,
  formatGhanaPhone 
} from "@/app/lib/payment-utils"
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SOG-${timestamp}-${random}`
}

/**
 * Paystack Payment Initialization
 * Creates order and initializes Paystack payment
 */
export async function POST(req: NextRequest) {
  try {
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured" },
        { status: 500 }
      )
    }

    // Get user session if authenticated (guest checkout is allowed)
    const tokenPayload = await getSessionFromToken();
    const userId = tokenPayload?.userId || null;
    
    const body = await req.json()

    const {
      items,
      shipping,
      deliveryMethod,
      subtotal,
      shippingCost,
      discount,
      total,
      promoCode,
      paymentMethod,
      mobileMoneyPhone,
      mobileMoneyProvider,
    } = body

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!shipping || !shipping.email || !shipping.fullName) {
      return NextResponse.json({ error: "Shipping information is required" }, { status: 400 })
    }

    if (!validateEmail(shipping.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Mobile money validation (only required for mobile money payments)
    if (paymentMethod === "mobile_money") {
      if (!mobileMoneyPhone || !mobileMoneyProvider) {
        return NextResponse.json({ error: "Mobile money information is required" }, { status: 400 })
      }

      if (!validateGhanaPhone(mobileMoneyPhone)) {
        return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
      }
    }

    // Server-side cart validation
    const validationResult = await validateCartItems(items)

    if (!validationResult.valid) {
      console.error("Cart validation failed:", validationResult.errors)
      return NextResponse.json(
        { 
          error: "Cart validation failed", 
          details: validationResult.errors 
        },
        { status: 400 }
      )
    }

    const validatedItems = validationResult.validatedItems || items
    const validatedSubtotal = validationResult.correctedSubtotal || subtotal

    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey()

    // Check for duplicate order
    const existingOrders = await adminDB.getMany<Order>(
      COLLECTIONS.ORDERS,
      { orderBy: "idempotencyKey", equalTo: idempotencyKey, limitToFirst: 1 }
    )

    if (existingOrders.length > 0) {
      const existingOrder = existingOrders[0]
      return NextResponse.json(
        { 
          error: "Duplicate payment detected",
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
        },
        { status: 409 }
      )
    }

    // Sanitize amounts
    const sanitizedSubtotal = sanitizeAmount(validatedSubtotal)
    const sanitizedShippingCost = sanitizeAmount(shippingCost)
    const sanitizedDiscount = sanitizeAmount(discount)
    const sanitizedTotal = sanitizeAmount(sanitizedSubtotal + sanitizedShippingCost - sanitizedDiscount)

    // Create shipping address first
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const shippingAddress = await adminDB.create<Address>(COLLECTIONS.ADDRESSES, addressId, {
      userId: userId ?? undefined,
      fullName: shipping.fullName,
      email: shipping.email,
      phone: shipping.phone,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2,
      city: shipping.city,
      region: shipping.region,
      postalCode: shipping.postalCode,
      country: shipping.country || "Ghana",
      isDefault: false,
    })

    // Create order in database
    const orderNumber = generateOrderNumber()
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create order items
    const orderItems: OrderItem[] = validatedItems.map((item: any, index: number) => ({
      id: `item_${orderId}_${index}`,
      orderId,
      productId: item.productId || item.id,
      productName: item.name,
      productImage: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      createdAt: new Date(),
    }))

    const order = await adminDB.create<Order>(COLLECTIONS.ORDERS, orderId, {
      orderNumber,
      userId: userId ?? undefined,
      email: shipping.email,
      phone: shipping.phone,
      status: 'PENDING',
      subtotal: sanitizedSubtotal,
      shippingCost: sanitizedShippingCost,
      discountAmount: sanitizedDiscount,
      totalAmount: sanitizedTotal,
      promoCode,
      paymentMethod: paymentMethod || "card",
      paymentStatus: 'PENDING',
      mobileMoneyProvider: paymentMethod === "mobile_money" ? mobileMoneyProvider : undefined,
      mobileMoneyPhone: paymentMethod === "mobile_money" ? formatGhanaPhone(mobileMoneyPhone) : undefined,
      deliveryMethod,
      idempotencyKey,
      shippingAddressId: addressId,
      shippingAddress,
      webhookProcessed: false,
      items: orderItems,
    })

    // Initialize Paystack payment
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: shipping.email,
        amount: Math.round(sanitizedTotal * 100), // Convert to pesewas
        reference: orderNumber, // Use order number as reference
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          idempotencyKey,
          paymentMethod: paymentMethod || "card",
          custom_fields: paymentMethod === "mobile_money" ? [
            {
              display_name: "Mobile Money Provider",
              variable_name: "mobile_money_provider",
              value: mobileMoneyProvider,
            },
            {
              display_name: "Mobile Money Phone",
              variable_name: "mobile_money_phone",
              value: formatGhanaPhone(mobileMoneyPhone),
            },
          ] : [],
        },
      }),
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      // Rollback order creation
      await adminDB.delete(COLLECTIONS.ORDERS, order.id)
      return NextResponse.json(
        { error: errorData.message || "Failed to initialize payment" },
        { status: 500 }
      )
    }

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      // Rollback order creation
      await adminDB.delete(COLLECTIONS.ORDERS, order.id)
      return NextResponse.json(
        { error: paystackData.message || "Failed to initialize payment" },
        { status: 500 }
      )
    }

    // Update order with Paystack reference
    await adminDB.update<Order>(COLLECTIONS.ORDERS, order.id, {
      paystackReference: paystackData.data.reference,
    })

    // Increment promo code usage if applicable (ATOMIC)
    if (promoCode) {
      try {
        const promos = await adminDB.getMany<PromoCode>(
          COLLECTIONS.PROMO_CODES,
          { orderBy: "code", equalTo: promoCode.toUpperCase(), limitToFirst: 1 }
        )
        if (promos.length > 0) {
          const promo = promos[0]
          // Use Firebase transaction for atomic increment
          const { database } = await import("@/app/lib/firebase/config")
          const { ref, runTransaction } = await import("firebase/database")
          
          const promoRef = ref(database, `${COLLECTIONS.PROMO_CODES}/${promo.id}/usedCount`)
          await runTransaction(promoRef, (currentCount) => {
            return (currentCount || 0) + 1
          })
        }
      } catch (error) {
        console.error('Failed to increment promo code usage:', error)
        // Don't fail the order if promo increment fails
      }
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.data.authorization_url,
      accessCode: paystackData.data.access_code,
      reference: paystackData.data.reference,
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error: any) {
    console.error("Paystack checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment" },
      { status: 500 }
    )
  }
}

