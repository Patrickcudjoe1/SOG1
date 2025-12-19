"use client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"


export default function FeaturedCollection() {
  const images = [
    "/sogbb.webp", 
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [images.length])

  return (
    <>
      <Navbar />
      <section className="w-full relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with fade */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex] || "/placeholder.svg"}
            alt="SOG Presence Collection"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white tracking-widest uppercase font-bold mb-8"
          style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
        >
          SOG Presence Collection
        </motion.h1>

        {/* Shop Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/shop">
            <button className="btn-outline-white">Shop</button>
          </Link>
        </motion.div>
      </div>
      </section>
    
    </>
    
    

  )
  
}
