"use client"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/app/lib/currency"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const products = [
    {
      id: "1",
      image: "/jerseys/jersey-1.jpg",
      title: "JERSEY GOLD-DARK",
      price: 350,
    },
    {
      id: "2",
      image: "/jerseys/jersey-2.jpg",
      title: "JERSEY GOLD-LIGHT",
      price: 350,
    },
    {
      id: "3",
      image: "/jerseys/jersey-3.jpg",
      title: "JERSEY GREEN",
      price: 350,
    },
    {
      id: "4",
      image: "/jerseys/jersey-4.jpg",
      title: "JERSEY WINE",
      price: 350,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const touchThreshold = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > touchThreshold
    const isRightSwipe = distance < -touchThreshold

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section className="w-full bg-white">
      {/* Mobile: Full-Width Editorial Image First */}
      <div className="md:hidden w-full h-[80vh] min-h-[600px] relative bg-gray-100">
        <Image
          src="/SOG14.jpg"
          alt="Editorial"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Desktop: 2-Column Layout */}
      <div className="hidden md:grid md:grid-cols-2 min-h-screen">
        
        {/* Left: Large Product Image - Desktop Only */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-100 relative w-full h-auto min-h-[120vh]"
        >
          <Image
            src="/SOG14.jpg"
            alt="Featured product"
            fill
            sizes="50vw"
            className="object-contain md:object-cover"
            priority
          />
        </motion.div>

        {/* Right: Shop The Look - Desktop */}
        <div className="flex flex-col items-center justify-center px-12 py-16 w-full">
          
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl tracking-widest uppercase mb-12 text-center font-bold"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            SHOP THE LOOK
          </motion.h2>

          {/* Desktop: Horizontal Grid View */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-6xl">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center cursor-pointer group"
              >
                <Link href="/jerseys">
                  <div className="bg-gray-50 aspect-square mb-6 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <p className="text-xs tracking-widest uppercase font-bold" style={{ fontFamily: 'var(--font-brand)' }}>
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 font-bold">
                    {formatCurrency(product.price)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Shop The Look Section */}
      <div className="md:hidden w-full bg-white py-12">
        <div className="w-full px-4">
          {/* Header */}
          <h2
            className="text-2xl tracking-widest uppercase mb-10 text-center font-bold"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            SHOP THE LOOK
          </h2>

          {/* Product Slider */}
          <div className="relative w-full">
            {/* Image Container with Swipe Support */}
            <div
              className="relative w-full aspect-[3/4] mb-8 px-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-4"
                >
                  <Link href="/jerseys" className="block w-full h-full">
                    <Image
                      src={products[currentIndex].image}
                      alt={products[currentIndex].title}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={currentIndex === 0}
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows - Always Visible */}
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-500 opacity-70"
                aria-label="Previous product"
              >
                <ChevronLeft size={20} strokeWidth={1} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-500 opacity-70"
                aria-label="Next product"
              >
                <ChevronRight size={20} strokeWidth={1} />
              </button>
            </div>

            {/* Product Name - No Price on Mobile */}
            <Link href="/jerseys" className="block text-center">
              <p 
                className="text-xs tracking-[0.15em] uppercase font-bold text-center"
                style={{ fontFamily: 'var(--font-brand)' }}
              >
                {products[currentIndex].title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
