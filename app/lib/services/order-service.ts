import { adminDB, COLLECTIONS, Order, OrderItem, Address, OrderStatus, PaymentStatus } from "../firebase/admin-db"

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
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create shipping address first
    const shippingAddress = await adminDB.create<Address>(
      COLLECTIONS.ADDRESSES,
      addressId,
      {
        userId: data.userId ?? undefined,
        fullName: data.shipping.fullName,
        email: data.shipping.email,
        phone: data.shipping.phone ?? undefined,
        addressLine1: data.shipping.addressLine1,
        addressLine2: data.shipping.addressLine2 ?? undefined,
        city: data.shipping.city,
        region: data.shipping.region ?? undefined,
        postalCode: data.shipping.postalCode,
        country: data.shipping.country || "Ghana",
        isDefault: false,
      }
    )

    // Create order items
    const orderItems: OrderItem[] = data.items.map((item, index) => ({
      id: `item_${orderId}_${index}`,
      orderId,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage ?? undefined,
      price: item.price,
      quantity: item.quantity,
      size: item.size ?? undefined,
      color: item.color ?? undefined,
      createdAt: new Date(),
    }))

    const order = await adminDB.create<Order>(COLLECTIONS.ORDERS, orderId, {
      orderNumber,
      userId: data.userId ?? undefined,
      email: data.email,
      phone: data.phone ?? undefined,
      status: 'PENDING',
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      promoCode: data.promoCode ?? undefined,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'PENDING',
      deliveryMethod: data.deliveryMethod,
      idempotencyKey: data.idempotencyKey,
      stripeSessionId: data.stripeSessionId ?? undefined,
      paystackReference: data.paystackReference ?? undefined,
      mobileMoneyTransactionId: data.mobileMoneyTransactionId ?? undefined,
      mobileMoneyProvider: data.mobileMoneyProvider ?? undefined,
      mobileMoneyPhone: data.mobileMoneyPhone ?? undefined,
      shippingAddressId: addressId,
      shippingAddress,
      webhookProcessed: false,
      items: orderItems,
    })

    return order
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string) {
    const order = await adminDB.get<Order>(COLLECTIONS.ORDERS, orderId)
    
    if (!order) return null

    // Check if user has access to this order
    if (userId && order.userId && order.userId !== userId) {
      return null
    }

    // Get shipping address if exists
    if (order.shippingAddressId) {
      const address = await adminDB.get<Address>(
        COLLECTIONS.ADDRESSES,
        order.shippingAddressId
      )
      if (address) {
        order.shippingAddress = address
      }
    }

    return order
  }

  /**
   * Get order by order number
   */
  static async getOrderByOrderNumber(orderNumber: string, userId?: string) {
    const orders = await adminDB.getMany<Order>(
      COLLECTIONS.ORDERS,
      { orderBy: 'orderNumber', equalTo: orderNumber, limitToFirst: 1 }
    )
    
    const order = orders[0] || null

    if (order && userId && order.userId && order.userId !== userId) {
      return null
    }

    return order
  }

  /**
   * Get orders for a user
   */
  static async getUserOrders(userId: string, limit = 50, offset = 0) {
    const allOrders = await adminDB.getMany<Order>(
      COLLECTIONS.ORDERS,
      { orderBy: 'userId', equalTo: userId }
    )

    // Sort by date descending
    allOrders.sort((a, b) => {
      const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime()
      const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime()
      return bTime - aTime
    })

    const total = allOrders.length
    const orders = allOrders.slice(offset, offset + limit)

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
    const updateData: any = { status }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }
    await adminDB.update<Order>(COLLECTIONS.ORDERS, orderId, updateData)
    return await adminDB.get<Order>(COLLECTIONS.ORDERS, orderId)
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    stripePaymentIntentId?: string
  ) {
    const updateData: any = {
      paymentStatus,
      webhookProcessed: true,
    }
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId
    }
    await adminDB.update<Order>(COLLECTIONS.ORDERS, orderId, updateData)
    return await adminDB.get<Order>(COLLECTIONS.ORDERS, orderId)
  }

  /**
   * Check for duplicate order by idempotency key
   */
  static async checkDuplicateOrder(idempotencyKey: string) {
    const orders = await adminDB.getMany<Order>(
      COLLECTIONS.ORDERS,
      { orderBy: 'idempotencyKey', equalTo: idempotencyKey, limitToFirst: 1 }
    )
    return orders[0] || null
  }

  /**
   * Get order by idempotency key (alias for checkDuplicateOrder)
   */
  static async getOrderByIdempotencyKey(idempotencyKey: string) {
    return await this.checkDuplicateOrder(idempotencyKey)
  }

  /**
   * Update order
   */
  static async updateOrder(orderId: string, data: Partial<Order>) {
    await adminDB.update<Order>(COLLECTIONS.ORDERS, orderId, data)
    return await adminDB.get<Order>(COLLECTIONS.ORDERS, orderId)
  }

  /**
   * Delete order (for rollback on payment failure)
   */
  static async deleteOrder(orderId: string) {
    await adminDB.delete(COLLECTIONS.ORDERS, orderId)
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(userId?: string) {
    const constraints = userId ? { orderBy: 'userId', equalTo: userId } : undefined
    const orders = await adminDB.getMany<Order>(COLLECTIONS.ORDERS, constraints)

    const total = orders.length
    const pending = orders.filter(o => o.status === 'PENDING').length
    const processing = orders.filter(o => o.status === 'PROCESSING').length
    const completed = orders.filter(o => o.status === 'DELIVERED').length
    const cancelled = orders.filter(o => o.status === 'CANCELLED').length

    const revenue = orders
      .filter(o => o.paymentStatus === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      revenue,
    }
  }
}

