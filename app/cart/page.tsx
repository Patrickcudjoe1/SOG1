"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { ShoppingBag, Plus, Minus, X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../components/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/app/lib/currency";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const total = getCartTotal();

  const handleQuantityChange = (itemId: string, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size, color);
        } else {
      updateQuantity(itemId, newQuantity, size, color);
    }
  };

  const handleRemoveItem = (itemId: string, size?: string, color?: string) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(itemId, size, color);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="w-full min-h-screen">
        <Navbar forceDark={true} />
        <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md w-full"
          >
            <ShoppingBag size={64} className="mx-auto mb-8 opacity-50" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Your Cart</h1>
            <p className="text-sm font-light text-gray-600 mb-8">Your cart is currently empty</p>
            <Link href="/shop" className="inline-block btn-outline">
              Continue Shopping
            </Link>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
    }

  return (
    <main className="w-full min-h-screen">
      <Navbar forceDark={true} />
      <section className="w-full py-8 md:py-12 lg:py-20 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light tracking-wide mb-6 md:mb-8 lg:mb-12">SHOPPING CART</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {cart.map((item, idx) => {
                const itemKey = `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
                return (
                  <motion.div
                    key={itemKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-gray-200 pb-4 md:pb-6 last:border-b-0"
                  >
                    <div className="flex gap-4 md:gap-5 lg:gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.productId || item.id}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white border border-gray-200 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex-1">
                          <Link href={`/product/${item.productId || item.id}`}>
                            <h3 className="text-sm sm:text-base md:text-lg font-light tracking-wide mb-1 md:mb-2 hover:opacity-60 transition-opacity line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="text-xs md:text-sm text-gray-600 space-y-0.5 md:space-y-1 mb-2 md:mb-4">
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                    </div>
                          <p className="text-sm md:text-base font-light mb-3 md:mb-0">{formatCurrency(item.price)}</p>
              </div>

                        {/* Quantity Controls - Mobile Optimized */}
                        <div className="flex items-center justify-between mt-2 md:mt-4 gap-2">
                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                              className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-gray-100 transition-colors touch-manipulation"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} className="md:w-4 md:h-4" />
                            </button>
                            <span className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-light min-w-[2rem] md:min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                              className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-gray-100 transition-colors touch-manipulation"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} className="md:w-4 md:h-4" />
                            </button>
                      </div>

                          <div className="flex items-center gap-2 md:gap-4">
                            <p className="text-sm md:text-base font-light whitespace-nowrap">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                              className="text-gray-400 hover:text-black transition-colors p-1 touch-manipulation"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Clear Cart Button */}
              <div className="pt-2 md:pt-4">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your entire cart?")) {
                      clearCart();
                    }
                  }}
                  className="text-[10px] md:text-xs tracking-widest uppercase font-light text-gray-600 hover:text-black transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary - Mobile Optimized */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 md:top-8 border border-gray-200 p-4 md:p-6 lg:p-8 bg-white">
                <h2 className="text-base md:text-lg lg:text-xl font-light tracking-wide mb-4 md:mb-6">ORDER SUMMARY</h2>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-light text-gray-600">Subtotal</span>
                    <span className="font-light">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-light text-gray-600">Shipping</span>
                    <span className="font-light text-[10px] md:text-xs">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base font-light">Total</span>
                    <span className="text-sm md:text-base font-light">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full btn-outline text-center mb-3 md:mb-4 text-xs md:text-sm py-2.5 md:py-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full text-center text-[10px] md:text-xs tracking-widest uppercase font-light text-gray-600 hover:text-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
