import { 
  ref, 
  get, 
  set, 
  update, 
  remove,
  push,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  startAt,
  endAt,
  DataSnapshot
} from 'firebase/database'
import { database } from './config'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  image?: string
  emailVerified?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Address {
  id: string
  userId?: string
  fullName: string
  phone?: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  region?: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  status: OrderStatus
  totalAmount: number
  subtotal: number
  shippingCost: number
  discountAmount: number
  promoCode?: string
  paymentMethod: string
  paymentStatus: PaymentStatus
  stripePaymentIntentId?: string
  stripeSessionId?: string
  paystackReference?: string
  flutterwaveTxRef?: string
  mobileMoneyTransactionId?: string
  mobileMoneyProvider?: string
  mobileMoneyPhone?: string
  idempotencyKey?: string
  webhookProcessed: boolean
  items: OrderItem[]
  shippingAddressId?: string
  shippingAddress?: Address
  deliveryMethod?: string
  deliveryNotes?: string
  email: string
  phone?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage?: string
  price: number
  quantity: number
  size?: string
  color?: string
  createdAt: Date | string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: any
  category: string
  subCategory: string
  sizes: any
  bestseller: boolean
  inStock: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface PromoCode {
  id: string
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  validFrom: Date | string
  validUntil?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

// Collection paths
export const COLLECTIONS = {
  USERS: 'users',
  ADDRESSES: 'addresses',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  PROMO_CODES: 'promoCodes',
}

// Helper to convert dates to ISO strings for Realtime Database
const serializeDate = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString()
  }
  return date
}

// Helper to convert ISO strings back to Date objects
const deserializeDate = (dateString: string): Date => {
  return new Date(dateString)
}

// Helper to serialize data for Realtime Database
const serializeData = (data: any): any => {
  const serialized: any = {}
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      serialized[key] = value.toISOString()
    } else if (value !== undefined) {
      serialized[key] = value
    }
  }
  return serialized
}

// Helper to deserialize data from Realtime Database
const deserializeData = <T>(snapshot: DataSnapshot): T | null => {
  if (!snapshot.exists()) {
    return null
  }
  
  const data = snapshot.val()
  const result: any = { ...data }
  
  // Convert ISO strings back to Date objects for known date fields
  const dateFields = ['createdAt', 'updatedAt', 'emailVerified', 'validFrom', 'validUntil']
  for (const field of dateFields) {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = new Date(result[field])
      } catch (e) {
        // Keep as string if conversion fails
      }
    }
  }
  
  return result as T
}

// Helper to ensure Date object
const ensureDate = (date: Date | string): Date => {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

// Generic CRUD operations for Realtime Database
export const realtimeDB = {
  // Create
  async create<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    const dbRef = ref(database, `${collectionName}/${id}`)
    const timestamp = new Date().toISOString()
    const docData = serializeData({
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    
    await set(dbRef, docData)
    return { ...docData, createdAt: new Date(timestamp), updatedAt: new Date(timestamp) } as T
  },

  // Read single document
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const dbRef = ref(database, `${collectionName}/${id}`)
    const snapshot = await get(dbRef)
    return deserializeData<T>(snapshot)
  },

  // Read multiple documents with query
  async getMany<T>(
    collectionName: string,
    queryConstraints?: {
      orderBy?: string
      equalTo?: any
      startAt?: any
      endAt?: any
      limitToFirst?: number
    }
  ): Promise<T[]> {
    let dbQuery = ref(database, collectionName)
    
    if (queryConstraints?.orderBy) {
      dbQuery = query(dbQuery as any, orderByChild(queryConstraints.orderBy)) as any
      
      if (queryConstraints.equalTo !== undefined) {
        dbQuery = query(dbQuery as any, equalTo(queryConstraints.equalTo)) as any
      }
      if (queryConstraints.startAt !== undefined) {
        dbQuery = query(dbQuery as any, startAt(queryConstraints.startAt)) as any
      }
      if (queryConstraints.endAt !== undefined) {
        dbQuery = query(dbQuery as any, endAt(queryConstraints.endAt)) as any
      }
      if (queryConstraints.limitToFirst !== undefined) {
        dbQuery = query(dbQuery as any, limitToFirst(queryConstraints.limitToFirst)) as any
      }
    }
    
    const snapshot = await get(dbQuery)
    if (!snapshot.exists()) {
      return []
    }
    
    const results: T[] = []
    snapshot.forEach((childSnapshot) => {
      const data = deserializeData<T>(childSnapshot)
      if (data) {
        results.push(data)
      }
    })
    
    return results
  },

  // Update
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const dbRef = ref(database, `${collectionName}/${id}`)
    const updateData = serializeData({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    
    await update(dbRef, updateData)
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    const dbRef = ref(database, `${collectionName}/${id}`)
    await remove(dbRef)
  },

  // Count documents (requires loading all and counting)
  async count(collectionName: string, queryConstraints?: any): Promise<number> {
    const items = await this.getMany(collectionName, queryConstraints)
    return items.length
  },

  // Batch operations (Realtime Database doesn't have native batch, so we use multi-location update)
  async batchWrite(operations: Array<{
    type: 'set' | 'update' | 'delete'
    collectionName: string
    id: string
    data?: any
  }>): Promise<void> {
    const updates: any = {}
    const timestamp = new Date().toISOString()
    
    for (const op of operations) {
      const path = `${op.collectionName}/${op.id}`
      
      if (op.type === 'set') {
        updates[path] = serializeData({
          ...op.data,
          id: op.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      } else if (op.type === 'update') {
        // For updates, we need to merge with existing data
        const existingRef = ref(database, path)
        const existingSnapshot = await get(existingRef)
        const existingData = existingSnapshot.val() || {}
        
        updates[path] = {
          ...existingData,
          ...serializeData(op.data),
          updatedAt: timestamp,
        }
      } else if (op.type === 'delete') {
        updates[path] = null
      }
    }
    
    await update(ref(database), updates)
  },

  // Generate push ID for auto-incrementing keys
  generateId(collectionName: string): string {
    const dbRef = ref(database, collectionName)
    const newRef = push(dbRef)
    return newRef.key || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
}

// Export database instance
export { database }

// For backward compatibility with existing code
export const firestoreDB = realtimeDB