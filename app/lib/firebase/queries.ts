import { realtimeDB, COLLECTIONS, User, Order } from "./realtime-db";

/**
 * Optimized Firebase Realtime Database Queries
 * Uses indexes for fast lookups
 */

// Optimized query: Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await realtimeDB.getMany<User>(COLLECTIONS.USERS, {
    orderBy: "email",
    equalTo: email,
    limitToFirst: 1,
  });
  return users[0] || null;
}

// Optimized query: Find order by Stripe session ID
export async function findOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const orders = await realtimeDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "stripeSessionId",
    equalTo: sessionId,
    limitToFirst: 1,
  });
  return orders[0] || null;
}

// Optimized query: Find order by Paystack reference
export async function findOrderByPaystackReference(reference: string): Promise<Order | null> {
  const orders = await realtimeDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "paystackReference",
    equalTo: reference,
    limitToFirst: 1,
  });
  return orders[0] || null;
}

// Optimized query: Find order by order number
export async function findOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const orders = await realtimeDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "orderNumber",
    equalTo: orderNumber,
    limitToFirst: 1,
  });
  return orders[0] || null;
}

// Optimized query: Find order by Stripe payment intent ID
export async function findOrderByStripePaymentIntent(paymentIntentId: string): Promise<Order | null> {
  // Note: stripePaymentIntentId is not indexed, so this will be slower
  // Consider adding an index if this query is used frequently
  const orders = await realtimeDB.getMany<Order>(COLLECTIONS.ORDERS);
  return orders.find(o => o.stripePaymentIntentId === paymentIntentId) || null;
}

// Optimized query: Get user addresses
export async function getUserAddresses(userId: string): Promise<any[]> {
  const addresses = await realtimeDB.getMany<any>(COLLECTIONS.ADDRESSES, {
    orderBy: "userId",
    equalTo: userId,
  });
  return addresses;
}

// Optimized query: Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const orders = await realtimeDB.getMany<Order>(COLLECTIONS.ORDERS, {
    orderBy: "userId",
    equalTo: userId,
  });
  // Sort by creation date descending
  return orders.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}