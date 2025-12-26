"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOutUser } from "@/app/lib/firebase/auth"
import { clearUserCart } from "@/app/lib/cart-storage"
import { useAuth } from "@/app/components/AuthProvider"
import { useCart } from "@/app/components/CartContext"

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const cart = useCart()

  const handleSignOut = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      // Clear user-specific cart from localStorage
      if (user?.uid) {
        clearUserCart(user.uid)
      }
      
      // Clear cart context
      cart.clearCart()
      
      // Sign out from backend (clear JWT cookie)
      await fetch('/api/auth/signout', { 
        method: 'POST',
        credentials: 'same-origin'
      }).catch(console.error)
      
      // Sign out from Firebase
      await signOutUser()
      
      // Redirect to homepage using window.location for clean navigation
      window.location.href = "/"
    } catch (error) {
      // Still redirect even if sign out fails
      window.location.href = "/"
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <LogOut size={16} /> {loading ? "Signing Out..." : "Sign Out"}
    </button>
  )
}

