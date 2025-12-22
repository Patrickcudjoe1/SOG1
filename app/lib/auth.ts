import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || null,
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
