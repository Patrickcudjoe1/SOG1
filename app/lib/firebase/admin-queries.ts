import { adminDB, COLLECTIONS, User, Order } from "./admin-db"

/**
 * Server-side Firebase Realtime Database Queries using Admin SDK
 * These queries bypass security rules and should only be used in server-side code
 */

// Find user by email (admin)
export async function findUserByEmailAdmin(email: string): Promise<User | null> {
  const users = await adminDB.getMany<User>(COLLECTIONS.USERS, {
    orderBy: "email",
    equalTo: email,
    limitToFirst: 1,
  })
  return users[0] || null
}

// Find order by Stripe session ID (admin)
export async function findOrderByStripeSessionAdmin(sessionId: string): Promise<Order | null> {
  const orders = await adminDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "stripeSessionId",
    equalTo: sessionId,
    limitToFirst: 1,
  })
  return orders[0] || null
}

// Find order by Paystack reference (admin)
export async function findOrderByPaystackReferenceAdmin(reference: string): Promise<Order | null> {
  const orders = await adminDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "paystackReference",
    equalTo: reference,
    limitToFirst: 1,
  })
  return orders[0] || null
}

// Find order by order number (admin)
export async function findOrderByOrderNumberAdmin(orderNumber: string): Promise<Order | null> {
  const orders = await adminDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "orderNumber",
    equalTo: orderNumber,
    limitToFirst: 1,
  })
  return orders[0] || null
}

// Get user addresses (admin)
export async function getUserAddressesAdmin(userId: string): Promise<any[]> {
  const addresses = await adminDB.getMany<any>(COLLECTIONS.ADDRESSES, {
    orderBy: "userId",
    equalTo: userId,
  })
  return addresses
}

// Get user orders (admin)
export async function getUserOrdersAdmin(userId: string): Promise<Order[]> {
  const orders = await adminDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "userId",
    equalTo: userId,
  })
  // Sort by creation date descending
  return orders.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
}