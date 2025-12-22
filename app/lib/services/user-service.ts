import { PrismaClient, User } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export interface CreateUserData {
  name: string
  email: string
  password?: string
  image?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  image?: string
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = data.password ? await hash(data.password, 12) : null

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        image: data.image || null,
      },
    })

    return user
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, data: UpdateUserData) {
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email.toLowerCase()
    if (data.password) updateData.password = await hash(data.password, 12)
    if (data.image !== undefined) updateData.image = data.image

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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
   * Check if email exists
   */
  static async emailExists(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    })
    return !!user
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    const [user, orders, addresses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { userId },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.address.count({
        where: { userId },
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
        savedAddresses: addresses,
      },
    }
  }
}

