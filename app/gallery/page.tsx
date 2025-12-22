"use client"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { useState } from "react"
import Image from "next/image"

export default function GalleryPage() {
  const galleryImages = [
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

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />
      
      {/* Minimalist Lookbook Grid */}
      <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* 3-Column Grid with Thin Gutters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {galleryImages.map((item) => {
              const isHovered = hoveredId === item.id
              
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden group cursor-pointer bg-gray-100"
                  style={{ aspectRatio: '3/4' }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image with Muted Filter */}
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image || "/gallery/ddd.jpg"}
                      alt={item.label}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      style={{
                        filter: 'brightness(0.95) contrast(0.9) saturate(0.8)',
                      }}
                    />
                    {/* Cool grey/blue overlay for muted aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/5 to-gray-800/10 mix-blend-overlay" />
                  </div>

                  {/* Bold Numeric Typography - Appears on Hover */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div 
                      className="text-white font-bold tracking-tight"
                      style={{ 
                        fontFamily: 'var(--font-brand)',
                        fontSize: 'clamp(4rem, 12vw, 8rem)',
                        fontWeight: 400,
                        lineHeight: 1,
                        textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      {item.number}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
