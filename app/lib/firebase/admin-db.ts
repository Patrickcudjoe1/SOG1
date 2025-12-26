import { getAdminDatabase } from './admin'
import { 
  User, 
  Address, 
  Order, 
  Product, 
  PromoCode, 
  OrderItem,
  UserRole,
  OrderStatus,
  PaymentStatus,
  DiscountType
} from './realtime-db'

// Server-side database operations using Firebase Admin SDK
export const adminDB = {
  // Create document with auto-generated ID
  async create<T extends { id?: string; createdAt?: Date | string; updatedAt?: Date | string }>(
    collectionName: string,
    id: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T> {
    const db = getAdminDatabase()
    const timestamp = new Date().toISOString()
    const docData = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    
    // Filter out undefined values - Firebase Realtime DB doesn't accept undefined
    const cleanedData = this.removeUndefined(docData)
    
    const ref = db.ref(`${collectionName}/${id}`)
    await ref.set(cleanedData)
    
    // Return with Date objects
    return {
      ...data,
      id,
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
    } as T
  },

  // Read single document
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const db = getAdminDatabase()
    const ref = db.ref(`${collectionName}/${id}`)
    const snapshot = await ref.get()
    
    if (!snapshot.exists()) {
      return null
    }
    
    const data = snapshot.val()
    
    // Convert ISO strings back to Date objects
    if (data.createdAt) data.createdAt = new Date(data.createdAt)
    if (data.updatedAt) data.updatedAt = new Date(data.updatedAt)
    if (data.emailVerified) data.emailVerified = new Date(data.emailVerified)
    
    return data as T
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
    const db = getAdminDatabase()
    let ref = db.ref(collectionName)
    
    // Apply query constraints
    if (queryConstraints?.orderBy) {
      ref = ref.orderByChild(queryConstraints.orderBy) as any
    }
    if (queryConstraints?.equalTo !== undefined) {
      ref = ref.equalTo(queryConstraints.equalTo) as any
    }
    if (queryConstraints?.startAt !== undefined) {
      ref = ref.startAt(queryConstraints.startAt) as any
    }
    if (queryConstraints?.endAt !== undefined) {
      ref = ref.endAt(queryConstraints.endAt) as any
    }
    if (queryConstraints?.limitToFirst) {
      ref = ref.limitToFirst(queryConstraints.limitToFirst) as any
    }
    
    const snapshot = await ref.get()
    
    if (!snapshot.exists()) {
      return []
    }
    
    const results: T[] = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val()
      
      // Convert ISO strings back to Date objects
      if (data.createdAt) data.createdAt = new Date(data.createdAt)
      if (data.updatedAt) data.updatedAt = new Date(data.updatedAt)
      if (data.emailVerified) data.emailVerified = new Date(data.emailVerified)
      
      results.push(data as T)
    })
    
    return results
  },

  // Update
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const db = getAdminDatabase()
    const ref = db.ref(`${collectionName}/${id}`)
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    // Filter out undefined values - Firebase Realtime DB doesn't accept undefined
    const cleanedData = this.removeUndefined(updateData)
    
    await ref.update(cleanedData)
  },

  // Helper function to remove undefined values from objects
  removeUndefined(obj: any): any {
    if (obj === null || obj === undefined) {
      return null
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUndefined(item))
    }
    
    if (typeof obj === 'object' && !(obj instanceof Date)) {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = this.removeUndefined(value)
        }
      }
      return cleaned
    }
    
    return obj
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    const db = getAdminDatabase()
    const ref = db.ref(`${collectionName}/${id}`)
    await ref.remove()
  },

  // Count documents
  async count(collectionName: string, queryConstraints?: any): Promise<number> {
    const items = await this.getMany(collectionName, queryConstraints)
    return items.length
  },
}

// Export collections
export const COLLECTIONS = {
  USERS: 'users',
  ADDRESSES: 'addresses',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  PROMO_CODES: 'promoCodes',
}

export type { 
  User, 
  Address, 
  Order, 
  Product, 
  PromoCode, 
  OrderItem,
  OrderStatus,
  PaymentStatus,
  UserRole,
  DiscountType
}