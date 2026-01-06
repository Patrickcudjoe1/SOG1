"use client"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryImage {
  id: number
  image: string
  number: string
  category: 'Presence' | 'Harmony'
}

const categories: ('Presence' | 'Harmony')[] = ['Presence', 'Harmony']

export default function GalleryPage() {
  const galleryImages: GalleryImage[] = [
    // Presence Collection - Images from gallery folder
    { id: 1, image: "/gallery/ddd.jpg", number: "01", category: "Presence" },
    { id: 2, image: "/gallery/fff.jpg", number: "02", category: "Presence" },
    { id: 3, image: "/gallery/SOG_90-1.jpg", number: "03", category: "Presence" },
    { id: 4, image: "/gallery/SOG-_30.jpg", number: "04", category: "Presence" },
    { id: 5, image: "/gallery/SOG_118.jpg", number: "05", category: "Presence" },
    { id: 6, image: "/gallery/SOG_135.jpg", number: "06", category: "Presence" },
    { id: 7, image: "/gallery/SOG_137.jpg", number: "07", category: "Presence" },
    { id: 8, image: "/gallery/SOG_142.jpg", number: "08", category: "Presence" },
    { id: 9, image: "/gallery/SOG_124.jpg", number: "09", category: "Presence" },
    { id: 10, image: "/gallery/SOG_16.jpg", number: "10", category: "Presence" },
    { id: 11, image: "/gallery/SOG_75-1.jpg", number: "11", category: "Presence" },
    { id: 12, image: "/gallery/SOG_82r.jpg", number: "12", category: "Presence" },
    { id: 13, image: "/gallery/SOG_88.jpg", number: "13", category: "Presence" },
    { id: 14, image: "/gallery/SOG_99.jpg", number: "14", category: "Presence" },
    { id: 15, image: "/gallery/SOG _67.jpg", number: "15", category: "Presence" },
    { id: 16, image: "/gallery/SOG _74.jpg", number: "16", category: "Presence" },
    { id: 17, image: "/gallery/SOG_1000.jpg", number: "17", category: "Presence" },
    { id: 18, image: "/gallery/SOG_9.jpg", number: "18", category: "Presence" },
  
    // Harmony Collection - Images from gallery folder
    { id: 21, image: "/gallery/SOG-_43.jpg", number: "01", category: "Harmony" },
    { id: 22, image: "/gallery/SOG107.jpg", number: "02", category: "Harmony" },
    { id: 23, image: "/gallery/SOG999.jpg", number: "03", category: "Harmony" },
    { id: 24, image: "/gallery/SOG14.jpg", number: "04", category: "Harmony" },
    { id: 25, image: "/gallery/SOG600.jpg", number: "05", category: "Harmony" },
    { id: 26, image: "/gallery/SOG600-2.jpg", number: "06", category: "Harmony" },
    { id: 27, image: "/gallery/SOG800.jpg", number: "07", category: "Harmony" },
    { id: 28, image: "/gallery/SOG800-2.jpg", number: "08", category: "Harmony" },
    { id: 29, image: "/gallery/IMG_2831.JPG", number: "09", category: "Harmony" },
    { id: 30, image: "/gallery/IMG_9419.JPG", number: "10", category: "Harmony" },
    { id: 31, image: "/gallery/IMG_9422.JPG", number: "11", category: "Harmony" },
    { id: 32, image: "/gallery/IMG_9577.JPG", number: "12", category: "Harmony" },
    { id: 33, image: "/gallery/SOG-3-Digit-Serial-Number-_17.jpg", number: "13", category: "Harmony" },
    { id: 34, image: "/gallery/SOG-3-Digit-Serial-Number-_23.jpg", number: "14", category: "Harmony" },
    { id: 35, image: "/gallery/SOG-3-Digit-Serial-Number-_37.jpg", number: "15", category: "Harmony" },
    { id: 36, image: "/gallery/SOG-3-Digit-Serial-Number-_47.jpg", number: "16", category: "Harmony" },
    { id: 37, image: "/gallery/SOG-3-Digit-Serial-Number-_54.jpg", number: "17", category: "Harmony" },
    { id: 38, image: "/gallery/SOG-3-Digit-Serial-Number-_63.jpg", number: "18", category: "Harmony" },
   
  ]

  const [selectedCategory, setSelectedCategory] = useState<'Presence' | 'Harmony'>('Presence')

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
    // Close when clicking on the backdrop itself (not on children)
    const target = e.target as HTMLElement
    if (target.id === 'backdrop' || target.classList.contains('backdrop-overlay')) {
      handleCloseOverlay()
    }
  }

  const handleBackdropTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    // Close when tapping on the backdrop itself (not on children)
    const target = e.target as HTMLElement
    if (target.id === 'backdrop' || target.classList.contains('backdrop-overlay')) {
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
                      alt={`Gallery image ${item.number}`}
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
            onTouchStart={handleBackdropTouch}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCloseOverlay()
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCloseOverlay()
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm touch-manipulation cursor-pointer"
              aria-label="Close overlay"
            >
              <X size={24} className="md:w-6 md:h-6" strokeWidth={2} />
            </button>

            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm cursor-pointer touch-manipulation"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm cursor-pointer touch-manipulation"
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
              className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12 pointer-events-none"
            >
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center image-container pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseOverlay()
                }}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  handleCloseOverlay()
                }}
              >
                <Image
                  src={selectedImage.image}
                  alt={`Gallery image ${selectedImage.number}`}
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
                </motion.div>
              </motion.div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] text-white text-sm md:text-base font-light tracking-widest pointer-events-none">
              {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  )
}
