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
  category: 'Presence' | 'Trinity'
}

const categories: ('Presence' | 'Trinity')[] = ['Presence', 'Trinity']

export default function GalleryPage() {
  const galleryImages: GalleryImage[] = [
    // Presence Collection
    { id: 13, label: "Wisdom", image: "/presence/ddd.jpg", number: "01", category: "Presence" },
    { id: 14, label: "Mercy", image: "/presence/fff.jpg", number: "02", category: "Presence" },
    { id: 15, label: "Glory", image: "/presence/shirt-black.png", number: "03", category: "Presence" },
    { id: 16, label: "Honor", image: "/presence/shirt-pink.png", number: "04", category: "Presence" },
    { id: 17, label: "Praise", image: "/presence/shirt-white.png", number: "05", category: "Presence" },
    { id: 18, label: "Worship", image: "/presence/SOG_30.jpg", number: "06", category: "Presence" },
    { id: 19, label: "Victory", image: "/gallery/SOG_90-1.jpg", number: "07", category: "Presence" },
    { id: 20, label: "Crown", image: "/gallery/SOG-_30.jpg", number: "08", category: "Presence" },
    
    // Trinity Collection
    { id: 21, label: "Crown", image: "/gallery/SOG14.jpg", number: "01", category: "Trinity" },
    { id: 22, label: "Faith", image: "/gallery/SOG107.jpg", number: "02", category: "Trinity" },
    { id: 23, label: "Grace", image: "/gallery/SOG999.jpg", number: "03", category: "Trinity" },
    { id: 24, label: "Purpose", image: "/gallery/SOG_16.jpg", number: "04", category: "Trinity" },
    { id: 25, label: "Light", image: "/gallery/SOG_142.jpg", number: "05", category: "Trinity" },
    { id: 26, label: "Devotion", image: "/gallery/IMG_9419.JPG", number: "06", category: "Trinity" },
    { id: 27, label: "Spirit", image: "/gallery/IMG_9422.JPG", number: "07", category: "Trinity" },
    { id: 28, label: "Truth", image: "/gallery/IMG_9577.JPG", number: "08", category: "Trinity" },
    { id: 29, label: "Love", image: "/gallery/IMG_2831.JPG", number: "09", category: "Trinity" },
    { id: 30, label: "Peace", image: "/gallery/SOG-_43.jpg", number: "10", category: "Trinity" },
    { id: 31, label: "Hope", image: "/gallery/SOG-3-Digit-Serial-Number-_17.jpg", number: "11", category: "Trinity" },
    { id: 32, label: "Joy", image: "/gallery/SOG-3-Digit-Serial-Number-_23.jpg", number: "12", category: "Trinity" },
    { id: 33, label: "Strength", image: "/gallery/SOG-3-Digit-Serial-Number-_37.jpg", number: "13", category: "Trinity" },
    { id: 34, label: "Wisdom", image: "/gallery/SOG-3-Digit-Serial-Number-_54.jpg", number: "14", category: "Trinity" },
    { id: 35, label: "Mercy", image: "/gallery/SOG_75-1.jpg", number: "15", category: "Trinity" },
    { id: 36, label: "Glory", image: "/gallery/SOG-3-Digit-Serial-Number-_63.jpg", number: "16", category: "Trinity" },
    { id: 37, label: "Honor", image: "/gallery/SOG_135.jpg", number: "17", category: "Trinity" },
    { id: 38, label: "Praise", image: "/gallery/SOG_118.jpg", number: "18", category: "Trinity" },
  ]

  const [selectedCategory, setSelectedCategory] = useState<'Presence' | 'Trinity'>('Presence')

  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [tappedId, setTappedId] = useState<number | null>(null)

  // Filter images by selected category
  const filteredImages = galleryImages.filter(img => img.category === selectedCategory)

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
    // Close when clicking directly on the backdrop (not on children)
    if (e.target === e.currentTarget) {
      handleCloseOverlay()
    }
  }

  const handleBackdropTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    // Close when tapping directly on the backdrop (not on children)
    if (e.target === e.currentTarget) {
      handleCloseOverlay()
    }
  }

  const handleImageTap = (imageId: number) => {
    setTappedId(imageId)
    setTimeout(() => setTappedId(null), 300)
  }

  // Navigate to next/previous image in overlay
  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedImage) return
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % filteredImages.length
      setSelectedImage(filteredImages[nextIndex])
    } else {
      const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
      setSelectedImage(filteredImages[prevIndex])
    }
  }

  return (
    <main className="w-full bg-background min-h-screen">
      <Navbar />
      
      {/* Minimalist Lookbook Grid */}
      <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 pt-20 md:pt-24">
        <div className="max-w-[1400px] mx-auto">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm tracking-widest uppercase font-light transition-all duration-300 border ${
                  selectedCategory === category
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-black border-black hover:bg-black hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Responsive Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-3 lg:gap-4"
            >
              {filteredImages.map((item, idx) => {
              const isHovered = hoveredId === item.id
              const isTapped = tappedId === item.id
              
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="relative overflow-hidden group cursor-pointer bg-gray-100 aspect-[4/5] md:aspect-[3/4]"
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
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md backdrop-overlay"
            id="backdrop"
            onClick={handleBackdropClick}
            onTouchEnd={handleBackdropTouch}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCloseOverlay()
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm touch-manipulation"
              aria-label="Close overlay"
            >
              <X size={24} className="md:w-6 md:h-6" strokeWidth={2} />
            </button>

            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Container */}
            <div 
              className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12"
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center image-container"
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

            {/* Image Counter */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 text-white text-sm md:text-base font-light tracking-widest">
              {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  )
}
