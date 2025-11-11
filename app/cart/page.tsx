"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function Cart() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <ShoppingBag size={64} className="mx-auto mb-8 opacity-50" />
          <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Your Cart</h1>
          <p className="text-sm font-light text-gray-600 mb-8">Your cart is currently empty</p>
          <a href="/shop" className="inline-block btn-outline">
            Continue Shopping
          </a>
        </motion.div>
      </section>
      <Footer />
    </main>
  )
}
