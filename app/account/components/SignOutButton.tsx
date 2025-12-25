"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
      // Still redirect even if API call fails
      router.push("/")
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity"
    >
      <LogOut size={16} /> Sign Out
    </button>
  )
}

