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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white uppercase px-4 text-center"
          style={{ 
            fontFamily: 'var(--font-brand)',
            fontWeight: 300,
            fontSize: 'clamp(1.75rem, 6vw, 3.5rem)',
            lineHeight: '1.4',
            letterSpacing: '0.05em',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)'
          }}
        >
          <span className="block md:inline">SOG Presence</span>
          <span className="block md:inline md:ml-2">Collection</span>
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
