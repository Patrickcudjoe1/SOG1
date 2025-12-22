"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import Image from "next/image"
import CTAButtons from "../components/cta-buttons"


export default function FeaturedCollection() {
  const images = [
    "/SOG_90-1.jpg", 
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
          <motion.div
            key={currentIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt="SOG Presence Collection"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
        {/* Heading - Centered */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-[0.15em] uppercase leading-[1.3] sm:leading-[1.2] md:leading-[1.1] px-4 sm:px-2 sm:whitespace-nowrap font-bold max-w-[90vw] sm:max-w-none"
          style={{ 
            fontFamily: 'var(--font-brand)', 
            textShadow: '0 2px 8px rgba(0,0,0,0.7)'
          }}
        >
          SOG Presence Collection
        </motion.h1>

        {/* Shop and Lookbook Buttons - At Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full pb-4 md:pb-6"
        >
          <CTAButtons 
            button1Text="SHOP"
            button1Href="/shop"
            button2Text="LOOKBOOK"
            button2Href="/gallery"
            variant="white"
          />
        </motion.div>
      </div>
      </section>
    
    </>
    
    

  )
  
}
