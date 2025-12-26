/**
 * Cart Storage Utilities
 * Manages cart persistence in localStorage and syncs with user authentication
 */

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

const GUEST_CART_KEY = 'guest_cart'

/**
 * Get user-specific cart key
 */
const getUserCartKey = (userId: string): string => {
  return `cart_${userId}`
}

/**
 * Get cart from localStorage
 */
export const getCart = (userId?: string): CartItem[] => {
  if (typeof window === 'undefined') return []
  
  const key = userId ? getUserCartKey(userId) : GUEST_CART_KEY
  const stored = localStorage.getItem(key)
  
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error parsing cart:', error)
    return []
  }
}

/**
 * Save cart to localStorage
 */
export const saveCart = (cart: CartItem[], userId?: string): void => {
  if (typeof window === 'undefined') return
  
  const key = userId ? getUserCartKey(userId) : GUEST_CART_KEY
  localStorage.setItem(key, JSON.stringify(cart))
}

/**
 * Merge guest cart with user cart on login
 */
export const mergeGuestCartWithUserCart = (userId: string): CartItem[] => {
  if (typeof window === 'undefined') return []
  
  const guestCart = getCart()
  const userCart = getCart(userId)
  
  // If no guest cart, return user cart
  if (guestCart.length === 0) {
    return userCart
  }
  
  // Merge carts - combine items with same id
  const mergedCart = [...userCart]
  
  guestCart.forEach((guestItem) => {
    const existingItemIndex = mergedCart.findIndex(
      (item) => item.id === guestItem.id && 
                item.size === guestItem.size && 
                item.color === guestItem.color
    )
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      mergedCart[existingItemIndex].quantity += guestItem.quantity
    } else {
      // New item, add to cart
      mergedCart.push(guestItem)
    }
  })
  
  // Save merged cart to user's storage
  saveCart(mergedCart, userId)
  
  // Clear guest cart
  localStorage.removeItem(GUEST_CART_KEY)
  
  return mergedCart
}

/**
 * Clear user cart on logout
 */
export const clearUserCart = (userId: string): void => {
  if (typeof window === 'undefined') return
  
  const userCartKey = getUserCartKey(userId)
  localStorage.removeItem(userCartKey)
}
