import { redirect } from "next/navigation"
import { getSessionFromToken, TokenPayload } from "./jwt"
import { prisma } from "./db/prisma"

export async function getSession() {
  const tokenPayload = await getSessionFromToken()
  
  if (!tokenPayload) {
    return null
  }

  // Optionally verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  if (!user) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name || user.email?.split("@")[0] || null,
      role: user.role,
    },
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/signin")
  }
  return session
}
