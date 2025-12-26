import { firestoreDB, COLLECTIONS, User, Order, Address } from "../firebase/db"

export interface CreateUserData {
  id: string
  name: string
  email: string
  image?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  image?: string
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const user = await firestoreDB.create<User>(COLLECTIONS.USERS, data.id, {
      name: data.name,
      email: data.email.toLowerCase(),
      image: data.image || undefined,
      role: 'USER',
    })

    return user
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await firestoreDB.get<User>(COLLECTIONS.USERS, userId)
    if (!user) return null

    const [addresses, orders] = await Promise.all([
      firestoreDB.getMany<Address>(COLLECTIONS.ADDRESSES, {
        orderBy: 'userId',
        equalTo: userId
      }),
      firestoreDB.getMany<Order>(COLLECTIONS.ORDERS, {
        orderBy: 'userId',
        equalTo: userId
      }),
    ])

    return {
      ...user,
      addresses,
      _count: {
        orders: orders.length,
      },
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    const users = await firestoreDB.getMany<User>(
      COLLECTIONS.USERS,
      {
        orderBy: 'email',
        equalTo: email.toLowerCase()
      }
    )
    return users[0] || null
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, data: UpdateUserData) {
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email.toLowerCase()
    if (data.image !== undefined) updateData.image = data.image

    await firestoreDB.update<User>(COLLECTIONS.USERS, userId, updateData)

    return await firestoreDB.get<User>(COLLECTIONS.USERS, userId)
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    await firestoreDB.delete(COLLECTIONS.USERS, userId)
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string) {
    const users = await firestoreDB.getMany<User>(
      COLLECTIONS.USERS,
      {
        orderBy: 'email',
        equalTo: email.toLowerCase()
      }
    )
    return users.length > 0
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    const [user, orders, addressCount] = await Promise.all([
      firestoreDB.get<User>(COLLECTIONS.USERS, userId),
      firestoreDB.getMany<Order>(COLLECTIONS.ORDERS, {
        orderBy: 'userId',
        equalTo: userId
      }),
      firestoreDB.count(COLLECTIONS.ADDRESSES, {
        orderBy: 'userId',
        equalTo: userId
      }),
    ])

    if (!user) return null

    const totalOrders = orders.length
    const totalSpent = orders
      .filter((o) => o.paymentStatus === "COMPLETED")
      .reduce((sum, o) => sum + o.totalAmount, 0)

    const pendingOrders = orders.filter(
      (o) => o.status === "PENDING" || o.status === "PROCESSING"
    ).length

    return {
      user,
      stats: {
        totalOrders,
        totalSpent,
        pendingOrders,
        savedAddresses: addressCount,
      },
    }
  }
}