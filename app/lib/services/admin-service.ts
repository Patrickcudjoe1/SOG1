import { PrismaClient, UserRole } from "@prisma/client"
import { prisma } from "@/app/lib/db/prisma"

export class AdminService {
  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    return user?.role === "SUPER_ADMIN"
  }

  /**
   * Get all users with pagination
   */
  static async getUsers(limit = 50, offset = 0, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
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
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    })
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      completedOrders,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "COMPLETED" },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: "COMPLETED",
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: { totalAmount: true },
      }),
    ])

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          take: 3,
        },
      },
    })

    // Get top products (by order count)
    const orderItems = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    })

    return {
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        processingOrders,
        completedOrders,
        todayOrders,
        todayRevenue: todayRevenue._sum.totalAmount || 0,
      },
      recentOrders,
      topProducts: orderItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        totalQuantity: item._sum.quantity || 0,
        orderCount: item._count.id,
      })),
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
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus
    }

    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: "insensitive" as const } },
        { email: { contains: filters.search, mode: "insensitive" as const } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          shippingAddress: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
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
  static async updateOrderStatus(orderId: string, status: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
        shippingAddress: true,
      },
    })
  }
}

