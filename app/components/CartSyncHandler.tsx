"use client"

import { useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import { useCart } from './CartContext'
import { mergeGuestCartWithUserCart } from '@/app/lib/cart-storage'

/**
 * Handles cart synchronization between guest and authenticated users
 * This component must be rendered inside both AuthProvider and CartProvider
 * Only merges carts once when user logs in, never overwrites existing cart
 */
export function CartSyncHandler() {
  const { user } = useAuth()
  const { clearCart, addToCart, isLoaded } = useCart()
  const previousUserRef = useRef<string | null>(null)
  const hasMergedRef = useRef(false)

  useEffect(() => {
    // Only proceed if cart is loaded
    if (!isLoaded) return

    // User just logged in (transitions from null/guest to logged in)
    // Only merge ONCE when user first logs in
    if (user && user.uid !== previousUserRef.current && !hasMergedRef.current) {
      // User just logged in - merge guest cart with user cart
      const mergedCart = mergeGuestCartWithUserCart(user.uid)
      
      // Only update if there are items to merge
      if (mergedCart.length > 0) {
        // Clear current cart and add merged items
        clearCart()
        // Use setTimeout to ensure clearCart completes before adding items
        setTimeout(() => {
          mergedCart.forEach(item => addToCart(item))
        }, 0)
      }
      
      hasMergedRef.current = true
    }
    
    // User logged out (transitions from logged in to null)
    if (!user && previousUserRef.current !== null) {
      // User logged out - reset merge flag for next login
      hasMergedRef.current = false
    }
    
    // Update reference
    previousUserRef.current = user?.uid || null
  }, [user, isLoaded, clearCart, addToCart])

  return null // This component doesn't render anything
}
