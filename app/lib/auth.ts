import { auth } from "./auth-config"
import { redirect } from "next/navigation"

export async function getSession() {
  return await auth()
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/signin")
  }
  return session
}
