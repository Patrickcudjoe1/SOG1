import { firestoreDB, COLLECTIONS, User, Order, OrderStatus, UserRole } from "../firebase/db"
import { where } from "firebase/firestore"

export class AdminService {
  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await firestoreDB.get<User>(COLLECTIONS.USERS, userId)
    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await firestoreDB.get<User>(COLLECTIONS.USERS, userId)
    return user?.role === "SUPER_ADMIN"
  }

  /**
   * Get all users with pagination
   */
  static async getUsers(limit = 50, offset = 0, search?: string) {
    let users = await firestoreDB.getMany<User>(COLLECTIONS.USERS)

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter(u => 
        u.name?.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      )
    }

    // Sort by creation date descending
    users.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    // Get counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const [orders, addresses] = await Promise.all([
          firestoreDB.count(COLLECTIONS.ORDERS, [where('userId', '==', user.id)]),
          firestoreDB.count(COLLECTIONS.ADDRESSES, [where('userId', '==', user.id)]),
        ])
        return {
          ...user,
          _count: {
            orders,
            addresses,
          },
        }
      })
    )

    const total = usersWithCounts.length
    const paginatedUsers = usersWithCounts.slice(offset, offset + limit)

    return {
      users: paginatedUsers,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, role: UserRole) {
    await firestoreDB.update<User>(COLLECTIONS.USERS, userId, { role })
    return await firestoreDB.get<User>(COLLECTIONS.USERS, userId)
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    await firestoreDB.delete(COLLECTIONS.USERS, userId)
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const [users, orders] = await Promise.all([
      firestoreDB.getMany<User>(COLLECTIONS.USERS),
      firestoreDB.getMany<Order>(COLLECTIONS.ORDERS),
    ])

    const totalUsers = users.length
    const totalOrders = orders.length

    const completedOrders = orders.filter(o => o.paymentStatus === 'COMPLETED')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const processingOrders = orders.filter(o => o.status === 'PROCESSING').length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
    const todayOrders = orders.filter(o => {
      const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
      return orderDate >= todayStart
    }).length
    const todayRevenue = orders
      .filter(o => {
        const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
        return o.paymentStatus === 'COMPLETED' && orderDate >= todayStart
      })
      .reduce((sum, o) => sum + o.totalAmount, 0)

    // Get recent orders
    const recentOrders = orders
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 10)

    // Get top products
    const productStats: any = {}
    orders.forEach(order => {
      order.items?.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            totalQuantity: 0,
            orderCount: 0,
          }
        }
        productStats[item.productId].totalQuantity += item.quantity
        productStats[item.productId].orderCount += 1
      })
    })

    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.orderCount - a.orderCount)
      .slice(0, 10)

    return {
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        completedOrders: deliveredOrders,
        todayOrders,
        todayRevenue,
      },
      recentOrders,
      topProducts,
    }
  }

  /**
   * Get orders with filters
   */
  static async getOrders(
    limit = 50,
    offset = 0,
    filters?: {
      status?: string
      paymentStatus?: string
      search?: string
    }
  ) {
    let orders = await firestoreDB.getMany<Order>(COLLECTIONS.ORDERS)

    // Apply filters
    if (filters?.status) {
      orders = orders.filter(o => o.status === filters.status)
    }

    if (filters?.paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === filters.paymentStatus)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      orders = orders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.email.toLowerCase().includes(searchLower)
      )
    }

    // Sort by date descending
    orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    const total = orders.length
    const paginatedOrders = orders.slice(offset, offset + limit)

    return {
      orders: paginatedOrders,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: string) {
    await firestoreDB.update<Order>(COLLECTIONS.ORDERS, orderId, { 
      status: status as OrderStatus 
    })
    return await firestoreDB.get<Order>(COLLECTIONS.ORDERS, orderId)
  }
}

