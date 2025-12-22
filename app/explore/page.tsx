"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ExplorePage() {
  return (
    <main className="w-full bg-white">
      <Navbar />
      
      {/* Editorial Entry Section - Minimal Luxury Layout */}
      <section className="w-full min-h-screen bg-white">
        <div className="max-w-[1320px] mx-auto px-6 md:px-20 lg:px-24 pt-24 md:pt-32 lg:pt-36 pb-12 md:pb-2 lg:pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 min-h-[80vh] items-center">
            {/* Left: Text Block */}
            <div className="flex flex-col justify-center order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-[520px]"
              >
                {/* Headline */}
                <h1 
                  className="text-[32px] md:text-[48px] lg:text-[56px] font-light tracking-[0.02em] leading-[1.12] mb-10 md:mb-12 text-[#1A1A1A]"
                  style={{ fontFamily: 'var(--font-brand)' }}
                >
                  <span className="block">SON OF</span>
                  <span className="block">GOD</span>
                  <span className="block">PRESENCE</span>
                  
                </h1>

                {/* Body Copy */}
                <div className="space-y-5 md:space-y-6 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.65] text-[#444] font-light">
                  <p className="max-w-[65ch] mb-2 md:mb-3">
                    Son of God is more than a name. It is an identity anchored in faith.
                  </p>
                  <p className="max-w-[65ch]">
                    Born at the intersection of belief and culture, the brand exists to honor presence—the quiet strength of knowing who you are and whose you are. Every garment is designed as a daily expression of conviction, crafted to move with purpose and restraint in a world that often moves without direction.
                  </p>
                  <p className="max-w-[65ch]">
                    Son of God is for those who walk in discipline, who understand that faith is not loud, but it is powerful. It is not worn for validation, but for alignment. Our pieces reflect a commitment to simplicity, proportion, and form, allowing the message to exist without excess.
                  </p>
                  <p className="max-w-[65ch]">
                    Inspired by scripture, shaped by modern silhouettes, and grounded in everyday life, Son of God bridges the sacred and the street. It speaks to a generation that carries belief with confidence, lives with intention, and stands firm without needing to be seen.
                  </p>
                  <p className="max-w-[65ch]">
                    This is clothing for the faithful—not perfect, but present. For those who lead through example, move with grace, and remain rooted in truth. Son of God is not a trend. It is a calling.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Logo */}
            <div className="flex items-center justify-center order-1 md:order-2">
              <div className="relative w-full max-w-[600px] md:max-w-[650px] lg:max-w-[700px] aspect-square flex items-center justify-center bg-white">
                <Image
                  src="/logo.png"
                  alt="Son of God Logo"
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Fashion Lookbook Grid */}
      <section className="w-full bg-white">
        <div className="max-w-[1320px] mx-auto px-6 md:px-20 lg:px-24 pt-12 md:pt-2 lg:pt-4 pb-24 md:pb-32 lg:pb-36">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 md:gap-y-14">
            {[
              "/gallery/ddd.jpg",
              "/gallery/fff.jpg",
              "/gallery/SOG107.jpg",
              "/gallery/SOG14.jpg",
              "/gallery/IMG_9419.JPG",
              "/gallery/IMG_9422.JPG",
              "/gallery/IMG_9577.JPG",
              "/gallery/IMG_2831.JPG",
              "/gallery/SOG-_30.jpg",
              "/gallery/SOG999.jpg",
              "/gallery/SOG_16.jpg",
              "/gallery/SOG_142.jpg",
            ].map((imageSrc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt={`Editorial ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className="object-cover object-center"
                  style={{
                    filter: 'brightness(0.95) contrast(0.9) saturate(0.7)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
