"use client"

import { useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import { useCart } from './CartContext'
import { mergeGuestCartWithUserCart } from '@/app/lib/cart-storage'

/**
 * Handles cart synchronization between guest and authenticated users
 * This component must be rendered inside both AuthProvider and CartProvider
 */
export function CartSyncHandler() {
  const { user } = useAuth()
  const cart = useCart()
  const previousUserRef = useRef<string | null>(null)

  useEffect(() => {
    // Only merge when user logs in (transitions from null to logged in)
    if (user && user.uid !== previousUserRef.current) {
      // User just logged in - merge guest cart with user cart
      const mergedCart = mergeGuestCartWithUserCart(user.uid)
      
      // Update cart context with merged cart
      if (mergedCart.length > 0) {
        cart.clearCart()
        mergedCart.forEach(item => cart.addToCart(item))
      }
    }
    
    // Update reference
    previousUserRef.current = user?.uid || null
  }, [user, cart])

  return null // This component doesn't render anything
}