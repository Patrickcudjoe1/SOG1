import { PrismaClient, Order, OrderStatus, PaymentStatus } from "@prisma/client"

const prisma = new PrismaClient()

export interface CreateOrderData {
  userId?: string | null
  email: string
  phone?: string
  items: Array<{
    productId: string
    productName: string
    productImage?: string
    price: number
    quantity: number
    size?: string | null
    color?: string | null
  }>
  shipping: {
    fullName: string
    email: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    region?: string | null
    postalCode: string
    country?: string
  }
  subtotal: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  promoCode?: string | null
  paymentMethod: string
  deliveryMethod?: string
  idempotencyKey: string
  stripeSessionId?: string
  paystackReference?: string
  mobileMoneyTransactionId?: string
  mobileMoneyProvider?: string
  mobileMoneyPhone?: string
}

export class OrderService {
  /**
   * Generate unique order number
   */
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `SOG-${timestamp}-${random}`
  }

  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderData): Promise<Order> {
    const orderNumber = this.generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId || null,
        email: data.email,
        phone: data.phone || null,
        status: "PENDING",
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        promoCode: data.promoCode || null,
        paymentMethod: data.paymentMethod,
        paymentStatus: "PENDING",
        deliveryMethod: data.deliveryMethod || null,
        idempotencyKey: data.idempotencyKey,
        stripeSessionId: data.stripeSessionId || null,
        paystackReference: data.paystackReference || null,
        mobileMoneyTransactionId: data.mobileMoneyTransactionId || null,
        mobileMoneyProvider: data.mobileMoneyProvider || null,
        mobileMoneyPhone: data.mobileMoneyPhone || null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage || null,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
        },
        shippingAddress: {
          create: {
            userId: data.userId || null,
            fullName: data.shipping.fullName,
            email: data.shipping.email,
            phone: data.shipping.phone,
            addressLine1: data.shipping.addressLine1,
            addressLine2: data.shipping.addressLine2 || null,
            city: data.shipping.city,
            region: data.shipping.region || null,
            postalCode: data.shipping.postalCode,
            country: data.shipping.country || "Ghana",
            isDefault: false,
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return order
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Check if user has access to this order
    if (order && userId && order.userId !== userId) {
      return null
    }

    return order
  }

  /**
   * Get order by order number
   */
  static async getOrderByOrderNumber(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (order && userId && order.userId !== userId) {
      return null
    }

    return order
  }

  /**
   * Get orders for a user
   */
  static async getUserOrders(userId: string, limit = 50, offset = 0) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
          shippingAddress: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where: { userId } }),
    ])

    return {
      orders,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(paymentStatus && { paymentStatus }),
      },
    })
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    stripePaymentIntentId?: string
  ) {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        ...(stripePaymentIntentId && { stripePaymentIntentId }),
        webhookProcessed: true,
      },
    })
  }

  /**
   * Check for duplicate order by idempotency key
   */
  static async checkDuplicateOrder(idempotencyKey: string) {
    return await prisma.order.findUnique({
      where: { idempotencyKey },
    })
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(userId?: string) {
    const where = userId ? { userId } : {}

    const [total, pending, processing, completed, cancelled] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: "PENDING" } }),
      prisma.order.count({ where: { ...where, status: "PROCESSING" } }),
      prisma.order.count({ where: { ...where, status: "DELIVERED" } }),
      prisma.order.count({ where: { ...where, status: "CANCELLED" } }),
    ])

    const revenue = await prisma.order.aggregate({
      where: {
        ...where,
        paymentStatus: "COMPLETED",
      },
      _sum: {
        totalAmount: true,
      },
    })

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      revenue: revenue._sum.totalAmount || 0,
    }
  }
}

