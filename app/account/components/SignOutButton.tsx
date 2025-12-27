"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOutUser } from "@/app/lib/firebase/auth"
import { useState } from "react"

export default function SignOutButton() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      // Sign out from Firebase client
      await signOutUser()
      
      // Clear server-side session
      await fetch("/api/auth/signout", {
        method: "POST",
      })
      
      // Redirect to home
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
      alert("Failed to sign out. Please try again.")
      setIsSigningOut(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <LogOut size={16} /> {isSigningOut ? "Signing Out..." : "Sign Out"}
    </button>
  )
}

