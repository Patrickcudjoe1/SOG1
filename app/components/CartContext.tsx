"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, saveCart } from '@/app/lib/cart-storage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  productId?: string; // For linking back to product
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size?: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  validateCart: () => Promise<{ valid: boolean; errors: any[]; correctedItems?: CartItem[] }>;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate unique cart item key
const getCartItemKey = (item: CartItem): string => {
  return `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Cart will be loaded via auth state change in AuthProvider
        // This is just initial load for guest users
        const loadedCart = getCart();
        setCart(loadedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        saveCart(cart);
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((current) => {
      const itemKey = getCartItemKey(item);
      const existingItemIndex = current.findIndex(
        (cartItem) => getCartItemKey(cartItem) === itemKey
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updated = [...current];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + item.quantity,
        };
        return updated;
      } else {
        // New item, add to cart
        return [...current, item];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string, size?: string, color?: string) => {
    setCart((current) => {
      const itemKey = `${itemId}-${size || 'no-size'}-${color || 'no-color'}`;
      return current.filter((item) => getCartItemKey(item) !== itemKey);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }

    setCart((current) => {
      const itemKey = `${itemId}-${size || 'no-size'}-${color || 'no-color'}`;
      return current.map((item) => {
        if (getCartItemKey(item) === itemKey) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Server-side cart validation
  const validateCart = useCallback(async () => {
    if (cart.length === 0) {
      return { valid: false, errors: [{ message: "Cart is empty" }] };
    }

    try {
      const response = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (data.valid && data.validatedItems) {
        // Update cart with validated items (corrected prices, quantities, etc.)
        setCart(data.validatedItems);
      }

      return {
        valid: data.valid,
        errors: data.errors || [],
        correctedItems: data.validatedItems,
        correctedSubtotal: data.correctedSubtotal,
      };
    } catch (error) {
      console.error("Cart validation error:", error);
      return {
        valid: false,
        errors: [{ message: "Failed to validate cart. Please try again." }],
      };
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        validateCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
