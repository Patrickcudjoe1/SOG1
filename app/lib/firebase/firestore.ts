import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  writeBatch,
  DocumentData,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore'
import { firestore } from './config'

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
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
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
  createdAt: Date
  updatedAt: Date
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
  validFrom: Date
  validUntil?: Date
  createdAt: Date
  updatedAt: Date
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ADDRESSES: 'addresses',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  PROMO_CODES: 'promoCodes',
}

// Helper to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  return new Date(timestamp)
}

// Helper to convert Date to Firestore timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date)
}

// Generic CRUD operations
export const firestoreDB = {
  // Create
  async create<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    const docRef = doc(firestore, collectionName, id)
    const timestamp = Timestamp.now()
    const docData = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    await setDoc(docRef, docData)
    return docData as T
  },

  // Read single document
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(firestore, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as T
    }
    return null
  },

  // Read multiple documents with query
  async getMany<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const q = query(collection(firestore, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T))
  },

  // Update
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(firestore, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(firestore, collectionName, id)
    await deleteDoc(docRef)
  },

  // Count documents
  async count(collectionName: string, constraints: QueryConstraint[] = []): Promise<number> {
    const docs = await this.getMany(collectionName, constraints)
    return docs.length
  },

  // Batch operations
  async batchWrite(operations: Array<{
    type: 'set' | 'update' | 'delete'
    collectionName: string
    id: string
    data?: any
  }>): Promise<void> {
    const batch = writeBatch(firestore)
    
    for (const op of operations) {
      const docRef = doc(firestore, op.collectionName, op.id)
      
      if (op.type === 'set') {
        batch.set(docRef, {
          ...op.data,
          id: op.id,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      } else if (op.type === 'update') {
        batch.update(docRef, {
          ...op.data,
          updatedAt: Timestamp.now(),
        })
      } else if (op.type === 'delete') {
        batch.delete(docRef)
      }
    }
    
    await batch.commit()
  },

  // Query helpers
  where,
  orderBy,
  limit,
  startAfter,
}

// Export Firestore instance
export { firestore }
