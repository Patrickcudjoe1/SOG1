import { NextRequest, NextResponse } from "next/server"
import { verifyIdToken } from "@/app/lib/firebase/admin"
import { validateCartItems } from "@/app/lib/cart-validation"
import { 
  generateIdempotencyKey, 
  sanitizeAmount, 
  validateEmail,
  validateGhanaPhone,
  formatGhanaPhone 
} from "@/app/lib/payment-utils"
import { OrderService } from "@/app/lib/services/order-service"

// Generate transaction ID for mobile money
function generateTransactionId(): string {
  return `MM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

export async function POST(req: NextRequest) {
  try {
    // Get user session if authenticated (guest checkout is allowed)
    let userId: string | null = null
    const firebaseToken = req.cookies.get('firebase-id-token')?.value
    if (firebaseToken) {
      const decodedToken = await verifyIdToken(firebaseToken)
      if (decodedToken) {
        userId = decodedToken.uid
      }
    }
    
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
      mobileMoneyPhone,
      mobileMoneyProvider,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!shipping || !shipping.email || !shipping.fullName) {
      return NextResponse.json({ error: "Shipping information is required" }, { status: 400 })
    }

    if (!validateEmail(shipping.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!mobileMoneyPhone || !mobileMoneyProvider) {
      return NextResponse.json({ error: "Mobile money information is required" }, { status: 400 })
    }

    if (!validateGhanaPhone(mobileMoneyPhone)) {
      return NextResponse.json({ error: "Invalid Ghana phone number format. Use format: 0XXXXXXXXX" }, { status: 400 })
    }

    // Server-side cart validation
    const validationResult = await validateCartItems(items)

    if (!validationResult.valid) {
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
    const existingOrder = await OrderService.getOrderByIdempotencyKey(idempotencyKey)

    if (existingOrder) {
      return NextResponse.json(
        { 
          error: "Duplicate order detected",
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

    const transactionId = generateTransactionId()

    // Create order using OrderService
    const order = await OrderService.createOrder({
      userId,
      email: shipping.email,
      phone: shipping.phone,
      items: validatedItems.map((item: any) => ({
        productId: item.productId || item.id,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
      })),
      shipping: {
        fullName: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2 || null,
        city: shipping.city,
        region: shipping.region || null,
        postalCode: shipping.postalCode,
        country: shipping.country || "Ghana",
      },
      subtotal: sanitizedSubtotal,
      shippingCost: sanitizedShippingCost,
      discountAmount: sanitizedDiscount,
      totalAmount: sanitizedTotal,
      promoCode: promoCode || null,
      paymentMethod: "mobile_money",
      deliveryMethod: deliveryMethod || null,
      idempotencyKey,
      mobileMoneyTransactionId: transactionId,
      mobileMoneyProvider,
      mobileMoneyPhone: formatGhanaPhone(mobileMoneyPhone),
    })

    // TODO: Implement promo code usage tracking with Firebase
    // if (promoCode) {
    //   await PromoCodeService.incrementUsage(promoCode)
    // }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      transactionId,
      message: "Order created successfully. Please complete payment via mobile money.",
    })
  } catch (error: any) {
    console.error("Mobile money checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}