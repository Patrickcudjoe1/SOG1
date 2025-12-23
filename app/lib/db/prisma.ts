import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Database helper functions
 */

/**
 * Execute a database transaction
 */
export async function transaction<T>(
  callback: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback)
}

/**
 * Health check
 */
export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { healthy: true }
  } catch (error) {
    return { healthy: false, error: (error as Error).message }
  }
}

/**
 * Close database connection
 */
export async function disconnect() {
  await prisma.$disconnect()
}

