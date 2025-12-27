"use client"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryImage {
  id: number
  label: string
  image: string
  number: string
}

export default function GalleryPage() {
  const galleryImages: GalleryImage[] = [
    { id: 1, label: "Faith", image: "/gallery/ddd.jpg", number: "01" },
    { id: 2, label: "Grace", image: "/gallery/fff.jpg", number: "02" },
    { id: 3, label: "Purpose", image: "/gallery/SOG107.jpg", number: "03" },
    { id: 4, label: "Light", image: "/gallery/SOG14.jpg", number: "04" },
    { id: 5, label: "Devotion", image: "/gallery/IMG_9419.JPG", number: "05" },
    { id: 6, label: "Spirit", image: "/gallery/IMG_9422.JPG", number: "06" },
    { id: 7, label: "Truth", image: "/gallery/IMG_9577.JPG", number: "07" },
    { id: 8, label: "Love", image: "/gallery/IMG_2831.JPG", number: "08" },
    { id: 9, label: "Peace", image: "/gallery/SOG-_30.jpg", number: "09" },
    { id: 10, label: "Hope", image: "/gallery/SOG-_43.jpg", number: "10" },
    { id: 11, label: "Joy", image: "/gallery/SOG-3-Digit-Serial-Number-_17.jpg", number: "11" },
    { id: 12, label: "Strength", image: "/gallery/SOG-3-Digit-Serial-Number-_23.jpg", number: "12" },
    { id: 13, label: "Wisdom", image: "/gallery/SOG-3-Digit-Serial-Number-_37.jpg", number: "13" },
    { id: 14, label: "Mercy", image: "/gallery/SOG_75-1.jpg", number: "14" },
    { id: 15, label: "Glory", image: "/gallery/SOG-3-Digit-Serial-Number-_54.jpg", number: "15" },
    { id: 16, label: "Honor", image: "/gallery/SOG-3-Digit-Serial-Number-_63.jpg", number: "16" },
    { id: 17, label: "Praise", image: "/gallery/SOG999.jpg", number: "17" },
    { id: 18, label: "Worship", image: "/gallery/SOG_16.jpg", number: "18" },
    { id: 19, label: "Victory", image: "/gallery/SOG_142.jpg", number: "19" },
    { id: 20, label: "Crown", image: "/gallery/SOG_135.jpg", number: "20" },
    { id: 21, label: "Crown", image: "/gallery/SOG_118.jpg", number: "21" },
  ]

  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [tappedId, setTappedId] = useState<number | null>(null)

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

  const handleImageClick = (image: GalleryImage) => {
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

  const handleImageTap = (imageId: number) => {
    setTappedId(imageId)
    setTimeout(() => setTappedId(null), 300)
  }

  return (
    <main className="w-full bg-background min-h-screen">
      <Navbar />
      
      {/* Minimalist Lookbook Grid */}
      <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 pt-20 md:pt-24">
        <div className="max-w-[1400px] mx-auto">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {galleryImages.map((item) => {
              const isHovered = hoveredId === item.id
              const isTapped = tappedId === item.id
              
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden group cursor-pointer bg-gray-100"
                  style={{ aspectRatio: '3/4' }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleImageClick(item)}
                  onTouchStart={() => handleImageTap(item.id)}
                >
                  {/* Image with Muted Filter */}
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image || "/gallery/ddd.jpg"}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      style={{
                        filter: 'brightness(0.95) contrast(0.9) saturate(0.8)',
                      }}
                    />
                    {/* Cool grey/blue overlay for muted aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/5 to-gray-800/10 mix-blend-overlay" />
                  </div>

                  {/* Semi-transparent overlay on hover (desktop) or tap (mobile) */}
                  <div 
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                      isHovered || isTapped ? 'opacity-100' : 'opacity-0 md:opacity-0'
                    }`}
                  />

                  {/* Look Number - Visible on mobile, appears on hover on desktop */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isHovered || isTapped ? 'opacity-100' : 'md:opacity-0 opacity-60'
                    }`}
                  >
                    <div 
                      className="text-white font-bold tracking-tight"
                      style={{ 
                        fontFamily: 'var(--font-brand)',
                        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                        fontWeight: 400,
                        lineHeight: 1,
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)'
                      }}
                    >
                      Look {item.number}
                    </div>
                  </div>
                </div>
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
                  src={selectedImage.image}
                  alt={selectedImage.label}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
                
                {/* Look Number in Overlay - Bottom Left */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute bottom-4 left-4 md:bottom-8 md:left-8"
                >
                  <div 
                    className="text-white font-bold tracking-tight"
                    style={{ 
                      fontFamily: 'var(--font-brand)',
                      fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
                      fontWeight: 400,
                      lineHeight: 1,
                      textShadow: '0 2px 20px rgba(0,0,0,0.8)'
                    }}
                  >
                    Look {selectedImage.number}
                  </div>
                  <div className="text-white/80 text-sm md:text-base mt-2 font-light tracking-wide">
                    {selectedImage.label}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  )
}
