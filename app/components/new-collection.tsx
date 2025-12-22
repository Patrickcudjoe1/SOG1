"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import CTAButtons from "./cta-buttons"

export default function NewCollection() {
  return (
    <section className="w-full bg-white">
      {/* Collection Hero Section - Lookbook */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/sogbb.webp"
            alt="Lookbook"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/25" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center h-full text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto"
        >
          {/* Heading - Centered */}
          <motion.h2 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-[0.15em] uppercase leading-[1.3] sm:leading-[1.2] md:leading-[1.1] px-4 sm:px-2 sm:whitespace-nowrap font-bold max-w-[90vw] sm:max-w-none"
            style={{ 
              fontFamily: 'var(--font-brand)', 
              textShadow: '0 2px 8px rgba(0,0,0,0.7)'
            }}
          >
            The New Collection 777 
          </motion.h2>
          
          {/* Buttons - At Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full pb-4 md:pb-6"
          >
            <CTAButtons 
              button1Text="EXPLORE"
              button1Href="/explore"
              button2Text="SHOP"
              button2Href="/shop"
              variant="white"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
