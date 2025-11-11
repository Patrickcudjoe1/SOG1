"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NewCollection() {
  return (
    <section className="w-full bg-white">
      {/* Collection Hero Section - Lookbook */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          src="/SOG106.jpg"
          alt="Lookbook"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.h2 className="text-4xl md:text-5xl lg:text-7xl text-white tracking-widest uppercase font-light mb-12 leading-tight">
            Collection Nine Menswear
          </motion.h2>
          <Link href="/gallery">
            <motion.button whileHover={{ scale: 1.02 }} className="btn-outline-white">
              Discover The Lookbook
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
