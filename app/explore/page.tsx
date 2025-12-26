"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ExploreImage {
  src: string
  index: number
}

export default function ExplorePage() {
  const exploreImages: ExploreImage[] = [
    { src: "/gallery/ddd.jpg", index: 0 },
    { src: "/gallery/fff.jpg", index: 1 },
    { src: "/gallery/SOG107.jpg", index: 2 },
    { src: "/gallery/SOG14.jpg", index: 3 },
    { src: "/gallery/IMG_9419.JPG", index: 4 },
    { src: "/gallery/IMG_9422.JPG", index: 5 },
    { src: "/gallery/IMG_9577.JPG", index: 6 },
    { src: "/gallery/IMG_2831.JPG", index: 7 },
    { src: "/gallery/SOG-_30.jpg", index: 8 },
    { src: "/gallery/SOG999.jpg", index: 9 },
    { src: "/gallery/SOG_16.jpg", index: 10 },
    { src: "/gallery/SOG_142.jpg", index: 11 },
  ]

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<ExploreImage | null>(null)
  const [tappedIndex, setTappedIndex] = useState<number | null>(null)

  // Disable body scroll when overlay is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  // Handle Escape key to close overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [selectedImage])

  const handleImageClick = (image: ExploreImage) => {
    setSelectedImage(image)
  }

  const handleCloseOverlay = () => {
    setSelectedImage(null)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseOverlay()
    }
  }

  const handleImageTap = (index: number) => {
    setTappedIndex(index)
    setTimeout(() => setTappedIndex(null), 300)
  }

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
            {exploreImages.map((item) => {
              const isHovered = hoveredIndex === item.index
              const isTapped = tappedIndex === item.index
              
              return (
                <motion.div
                  key={item.index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: item.index * 0.05 }}
                  viewport={{ once: true }}
                  className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(item.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleImageClick(item)}
                  onTouchStart={() => handleImageTap(item.index)}
                >
                  <Image
                    src={item.src}
                    alt={`Editorial ${item.index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                    className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                    style={{
                      filter: 'brightness(0.95) contrast(0.9) saturate(0.7)',
                    }}
                  />
                  
                  {/* Semi-transparent overlay on hover (desktop) or tap (mobile) */}
                  <div 
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                      isHovered || isTapped ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Full-Screen Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
            onClick={handleBackdropClick}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseOverlay}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Close overlay"
            >
              <X size={24} className="md:w-6 md:h-6" strokeWidth={2} />
            </button>

            {/* Image Container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.src}
                  alt={`Editorial ${selectedImage.index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
