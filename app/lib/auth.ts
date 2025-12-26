import { redirect } from "next/navigation"
import { auth } from "./firebase/config"

export async function getSession() {
  // Firebase handles auth client-side only
  // This function is kept for compatibility but returns null on server
  // Use useAuth() hook on client side instead
  return null
}

export async function requireAuth() {
  // Server-side auth check not supported with client-only Firebase
  // Redirect to signin - actual auth check happens client-side
  const user = auth.currentUser
  if (!user) {
    redirect("/signin")
  }
  return {
    user: {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || user.email?.split("@")[0] || '',
      role: 'USER',
    },
  }
}