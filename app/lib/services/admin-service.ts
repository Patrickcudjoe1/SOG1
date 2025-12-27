import { COLLECTIONS, User, Order, OrderStatus, UserRole } from "../firebase/db"
import { getAdminDatabase } from "../firebase/admin"

export class AdminService {
  /**
   * Get Admin Database instance
   */
  private static getDB() {
    return getAdminDatabase()
  }

  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    console.log('👤 [ADMIN SERVICE] Checking if user is admin:', userId)
    const db = this.getDB()
    const userRef = db.ref(`${COLLECTIONS.USERS}/${userId}`)
    const snapshot = await userRef.get()
    
    if (!snapshot.exists()) {
      console.log('❌ [ADMIN SERVICE] User not found in database:', userId)
      return false
    }
    
    const user = snapshot.val() as User
    console.log('👤 [ADMIN SERVICE] User data from DB:', {
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    console.log('👤 [ADMIN SERVICE] isAdmin result:', isAdmin, '(role:', user?.role, ')')
    
    return isAdmin
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(userId: string): Promise<boolean> {
    console.log('👑 [ADMIN SERVICE] Checking if user is super admin:', userId)
    const db = this.getDB()
    const userRef = db.ref(`${COLLECTIONS.USERS}/${userId}`)
    const snapshot = await userRef.get()
    
    if (!snapshot.exists()) {
      console.log('❌ [ADMIN SERVICE] User not found in database:', userId)
      return false
    }
    
    const user = snapshot.val() as User
    console.log('👑 [ADMIN SERVICE] User data from DB:', {
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    const isSuperAdmin = user?.role === "SUPER_ADMIN"
    console.log('👑 [ADMIN SERVICE] isSuperAdmin result:', isSuperAdmin, '(role:', user?.role, ')')
    
    return isSuperAdmin
  }

  /**
   * Get all users with pagination
   */
  static async getUsers(limit = 50, offset = 0, search?: string) {
    const db = this.getDB()
    const usersRef = db.ref(COLLECTIONS.USERS)
    const snapshot = await usersRef.get()
    
    if (!snapshot.exists()) {
      return {
        users: [],
        total: 0,
        limit,
        offset,
        hasMore: false,
      }
    }
    
    let users: User[] = []
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val() as User
      users.push(userData)
    })

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
        const ordersRef = db.ref(COLLECTIONS.ORDERS)
        const addressesRef = db.ref(COLLECTIONS.ADDRESSES)
        
        const [ordersSnapshot, addressesSnapshot] = await Promise.all([
          ordersRef.orderByChild('userId').equalTo(user.id).get(),
          addressesRef.orderByChild('userId').equalTo(user.id).get(),
        ])
        
        let ordersCount = 0
        let addressesCount = 0
        
        ordersSnapshot.forEach(() => { ordersCount++ })
        addressesSnapshot.forEach(() => { addressesCount++ })
        
        return {
          ...user,
          _count: {
            orders: ordersCount,
            addresses: addressesCount,
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
    const db = this.getDB()
    const userRef = db.ref(`${COLLECTIONS.USERS}/${userId}`)
    
    await userRef.update({
      role,
      updatedAt: new Date().toISOString(),
    })
    
    const snapshot = await userRef.get()
    return snapshot.val() as User
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    const db = this.getDB()
    const userRef = db.ref(`${COLLECTIONS.USERS}/${userId}`)
    await userRef.remove()
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const db = this.getDB()
    const [usersSnapshot, ordersSnapshot] = await Promise.all([
      db.ref(COLLECTIONS.USERS).get(),
      db.ref(COLLECTIONS.ORDERS).get(),
    ])
    
    const users: User[] = []
    const orders: Order[] = []
    
    usersSnapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val() as User)
    })
    
    ordersSnapshot.forEach((childSnapshot) => {
      orders.push(childSnapshot.val() as Order)
    })

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

    // Get top products - only from completed orders
    const productStats: any = {}
    completedOrders.forEach(order => {
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
      .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)

    // Calculate last 7 days chart data for dashboard
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    
    const dailyRevenue: { [key: string]: number } = {}
    
    orders.filter(o => {
      const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
      return orderDate >= last7Days && o.paymentStatus === 'COMPLETED'
    }).forEach(order => {
      const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)
      const dateKey = orderDate.toISOString().split('T')[0]
      
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = 0
      }
      dailyRevenue[dateKey] += order.totalAmount
    })

    const chartData = []
    const currentDate = new Date(last7Days)
    const now = new Date()
    
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split('T')[0]
      chartData.push({
        date: dateKey,
        revenue: dailyRevenue[dateKey] || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

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
      chartData,
    }
  }

  /**
   * Get analytics data with chart data for selected period
   */
  static async getAnalytics(period: string) {
    const db = this.getDB()
    const [usersSnapshot, ordersSnapshot] = await Promise.all([
      db.ref(COLLECTIONS.USERS).get(),
      db.ref(COLLECTIONS.ORDERS).get(),
    ])
    
    const users: User[] = []
    const orders: Order[] = []
    
    usersSnapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val() as User)
    })
    
    ordersSnapshot.forEach((childSnapshot) => {
      orders.push(childSnapshot.val() as Order)
    })

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Filter orders by period
    const periodOrders = orders.filter(o => {
      const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
      return orderDate >= startDate
    })

    const completedOrders = periodOrders.filter(o => o.paymentStatus === 'COMPLETED')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)

    // Calculate daily revenue for chart
    const dailyRevenue: { [key: string]: number } = {}
    
    completedOrders.forEach(order => {
      const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)
      const dateKey = orderDate.toISOString().split('T')[0] // YYYY-MM-DD
      
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = 0
      }
      dailyRevenue[dateKey] += order.totalAmount
    })

    // Create chart data array with all dates in range (fill gaps with 0)
    const chartData = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split('T')[0]
      chartData.push({
        date: dateKey,
        revenue: dailyRevenue[dateKey] || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate statistics for the period
    const totalOrders = periodOrders.length
    const pendingOrders = periodOrders.filter(o => o.status === 'PENDING').length
    const processingOrders = periodOrders.filter(o => o.status === 'PROCESSING').length
    const deliveredOrders = periodOrders.filter(o => o.status === 'DELIVERED').length

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
    const todayOrders = periodOrders.filter(o => {
      const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
      return orderDate >= todayStart
    }).length
    const todayRevenue = periodOrders
      .filter(o => {
        const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
        return o.paymentStatus === 'COMPLETED' && orderDate >= todayStart
      })
      .reduce((sum, o) => sum + o.totalAmount, 0)

    // Get top products from period
    const productStats: any = {}
    completedOrders.forEach(order => {
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
      .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)

    return {
      overview: {
        totalUsers: users.length,
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        completedOrders: deliveredOrders,
        todayOrders,
        todayRevenue,
      },
      chartData,
      topProducts,
      period,
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
    const db = this.getDB()
    const ordersRef = db.ref(COLLECTIONS.ORDERS)
    const snapshot = await ordersRef.get()
    
    if (!snapshot.exists()) {
      return {
        orders: [],
        total: 0,
        limit,
        offset,
        hasMore: false,
      }
    }
    
    let orders: Order[] = []
    snapshot.forEach((childSnapshot) => {
      orders.push(childSnapshot.val() as Order)
    })

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
    const db = this.getDB()
    const orderRef = db.ref(`${COLLECTIONS.ORDERS}/${orderId}`)
    
    await orderRef.update({
      status: status as OrderStatus,
      updatedAt: new Date().toISOString(),
    })
    
    const snapshot = await orderRef.get()
    return snapshot.val() as Order
  }
}

