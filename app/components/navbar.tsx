"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Search, User, ShoppingBag, ChevronRight, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "./CartContext"

interface NavbarProps {
  hasHeroSection?: boolean
}

export default function SONOFGODNavbar({ hasHeroSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileDropdowns, setMobileDropdowns] = useState({
    featured: false,
    collections: false,
    newArrivals: false,
  })
  const { cart } = useCart()
  const pathname = usePathname()

  // Pages that should always have black navbar
  const blackNavbarPages = ['/signin', '/signup', '/forgot-password', '/reset-password', '/shop', '/explore', '/cart']
  const isBlackNavbarPage = blackNavbarPages.includes(pathname || '')

  const toggleMobileDropdown = (dropdown: 'featured' | 'collections' | 'newArrivals') => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }))
  }

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Determine navbar colors based on scroll and page type
  const textColor = isBlackNavbarPage ? "text-white" : (scrolled ? "text-black" : "text-white")
  const bgColor = isBlackNavbarPage ? "bg-black" : (scrolled ? "bg-white" : "bg-transparent")

  return (
    <>
      <nav
        className={`sog-nav fixed top-0 left-0 right-0 w-full z-[60] transition-all duration-300
          ${bgColor} ${scrolled ? "shadow-md" : "shadow-none"}
        `}
        style={{ position: 'fixed' }}
      >
        <div className="max-w-full px-4 sm:px-6 md:px-12 py-3 md:py-4 transition-all duration-300">
          <div className="flex items-center justify-center relative h-12 md:h-14">

            {/* LEFT NAV - DESKTOP */}
            <div className="hidden md:flex items-center gap-10 absolute left-0 h-full">
              <div className="relative group flex items-center h-full">
                {/* Large Blurry Backdrop Overlay - FEATURED */}
                <div
                  className={`fixed inset-0 z-40 pointer-events-none
                    opacity-0 invisible transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:visible
                    backdrop-blur-xl
                    ${isBlackNavbarPage ? "bg-black/40" : (scrolled ? "bg-black/40" : "bg-white/30")}
                  `}
                />
                
                {/* FEATURED BUTTON */}
              <Link
                href="/"
                  className={`sog-link font-light uppercase transition-colors whitespace-nowrap relative z-50 flex items-center h-full ${textColor}`}
              >
                  FEATURED
              </Link>

                {/* FEATURED DROPDOWN */}
                <div
                  className={`absolute left-0 top-full mt-6 w-48 z-50
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 ease-out
                    backdrop-blur-md
                    ${isBlackNavbarPage ? "bg-black/80 text-white" : (scrolled ? "bg-white/90 text-black" : "bg-black/80 text-white")}
                  `}
              >
                  <div className="flex flex-col px-4 py-3 space-y-3 text-xs tracking-widest uppercase">
                    <Link href="/caps" className="hover:opacity-60">
                      CAPS
                    </Link>
                    <Link href="/tote-bags" className="hover:opacity-60">
                      TOTE BAGS
              </Link>
                  </div>
                </div>
              </div>

              <div className="relative group flex items-center h-full">
                {/* Large Blurry Backdrop Overlay - COLLECTIONS */}
                <div
                  className={`fixed inset-0 z-40 pointer-events-none
                    opacity-0 invisible transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:visible
                    backdrop-blur-xl
                    ${isBlackNavbarPage ? "bg-black/40" : (scrolled ? "bg-white/30" : "bg-black/40")}
                  `}
                />
                
  {/* COLLECTIONS BUTTON */}
  <Link
    href="/shop"
                  className={`sog-link font-light uppercase transition-colors whitespace-nowrap relative z-50 flex items-center h-full ${textColor}`}
  >
    COLLECTIONS
  </Link>

                {/* COLLECTIONS DROPDOWN */}
  <div
                  className={`absolute left-0 top-full mt-6 w-48 z-50
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-200 ease-out
                    backdrop-blur-md
                    ${isBlackNavbarPage ? "bg-black/80 text-white" : (scrolled ? "bg-white/90 text-black" : "bg-black/80 text-white")}
    `}
  >
    <div className="flex flex-col px-4 py-3 space-y-3 text-xs tracking-widest uppercase">
                    <Link href="/presence" className="hover:opacity-60">
        PRESENCE
      </Link>
                    <Link href="/trinity" className="hover:opacity-60">
        TRINITY
      </Link> 
    </div>
  </div>
</div>

              <div className="relative group flex items-center h-full">
                {/* Large Blurry Backdrop Overlay - NEW ARRIVALS */}
                <div
                  className={`fixed inset-0 z-40 pointer-events-none
                    opacity-0 invisible transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:visible
                    backdrop-blur-xl
                    ${isBlackNavbarPage ? "bg-black/40" : (scrolled ? "bg-white/30" : "bg-black/40")}
                  `}
                />
                
                {/* NEW ARRIVALS BUTTON */}
              <Link
                href="/new-arrivals"
                  className={`sog-link font-light uppercase transition-colors whitespace-nowrap relative z-50 flex items-center h-full ${textColor}`}
              >
                NEW ARRIVALS
              </Link>

                {/* NEW ARRIVALS DROPDOWN */}
                <div
                  className={`absolute left-0 top-full mt-6 w-48 z-50
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 ease-out
                    backdrop-blur-md
                    ${isBlackNavbarPage ? "bg-black/80 text-white" : (scrolled ? "bg-white/90 text-black" : "bg-black/80 text-white")}
                  `}
                >
                  <div className="flex flex-col px-4 py-3 space-y-3 text-xs tracking-widest uppercase">
                    <Link href="/hoodies" className="hover:opacity-60">
                      HOODIES
                    </Link>
                    <Link href="/jerseys" className="hover:opacity-60">
                      JERSEYS
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE HAMBURGER */}
            <button
              className={`md:hidden absolute left-0 p-2 transition-colors ${textColor}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* CENTER LOGO */}
            <Link
              href="/"
              className="relative flex items-center justify-center h-full"
            >
              <Image
                src="/logo.png"
                alt="SON OF GOD"
                width={300}
                height={80}
                className={`h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] transition-all duration-300 ${
                  isBlackNavbarPage || !scrolled ? "brightness-0 invert" : ""
                }`}
                style={{ width: "auto", height: "100%" }}
                priority
              />
            </Link>

            {/* RIGHT NAV – DESKTOP */}
            <div className="hidden md:flex items-center gap-6 absolute right-0">
              <Link
                href="/search"
                className={`w-8 h-8 hover:opacity-60 transition-opacity flex items-center justify-center ${textColor}`}
              >
                <Search size={15} />
              </Link>

              <Link
                href="/account"
                className={`w-8 h-8 hover:opacity-60 transition-opacity flex items-center justify-center ${textColor}`}
              >
                <User size={15} />
              </Link>

              <Link
                href="/cart"
                className={`w-8 h-8 hover:opacity-60 relative transition-opacity flex items-center justify-center ${textColor}`}
              >
                <ShoppingBag size={15} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>

            {/* RIGHT NAV – MOBILE */}
            <div className="md:hidden absolute right-0 flex items-center gap-3">
              <Link
                href="/search"
                className={`w-10 h-10 hover:opacity-60 flex items-center justify-center ${textColor}`}
              >
                <Search size={18} />
              </Link>

              <Link
                href="/cart"
                className={`w-10 h-10 hover:opacity-60 relative flex items-center justify-center ${textColor}`}
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          {/* Mobile Backdrop Blur Overlay - Shows when any dropdown is open */}
          {(mobileDropdowns.featured || mobileDropdowns.collections || mobileDropdowns.newArrivals) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[45] backdrop-blur-xl bg-black/40 pointer-events-none"
            />
          )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
            className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto`}
          >
            {/* Close Button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
                className="text-black hover:opacity-60 transition-opacity"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product Categories Section */}
            <div className="px-6 pb-4 space-y-4">
              {/* FEATURED - Expandable */}
              <div className="relative">
                <button
                  onClick={() => toggleMobileDropdown('featured')}
                  className="w-full flex items-center justify-between sog-link uppercase text-black hover:opacity-60 transition-opacity"
                >
                  <span>FEATURED</span>
                  <motion.div
                    animate={{ rotate: mobileDropdowns.featured ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </button>

                {/* FEATURED DROPDOWN */}
                <motion.div
                  initial={false}
                  animate={{
                    height: mobileDropdowns.featured ? 'auto' : 0,
                    opacity: mobileDropdowns.featured ? 1 : 0,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pl-4 space-y-3 backdrop-blur-md bg-white/90">
                    <Link
                      href="/caps"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      CAPS
                    </Link>
                    <Link
                      href="/tote-bags"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      TOTE BAGS
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* COLLECTIONS - Expandable */}
              <div className="relative">
                <button
                  onClick={() => toggleMobileDropdown('collections')}
                  className="w-full flex items-center justify-between sog-link uppercase text-black hover:opacity-60 transition-opacity"
                >
                  <span>COLLECTIONS</span>
                  <motion.div
                    animate={{ rotate: mobileDropdowns.collections ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </button>

                {/* COLLECTIONS DROPDOWN */}
                <motion.div
                  initial={false}
                  animate={{
                    height: mobileDropdowns.collections ? 'auto' : 0,
                    opacity: mobileDropdowns.collections ? 1 : 0,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pl-4 space-y-3 backdrop-blur-md bg-white/90">
                    <Link
                      href="/presence"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      PRESENCE
                    </Link>
                    <Link
                      href="/trinity"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      TRINITY
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* NEW ARRIVALS - Expandable */}
              <div className="relative">
                <button
                  onClick={() => toggleMobileDropdown('newArrivals')}
                  className="w-full flex items-center justify-between sog-link uppercase text-black hover:opacity-60 transition-opacity"
                >
                  <span>NEW ARRIVALS</span>
                  <motion.div
                    animate={{ rotate: mobileDropdowns.newArrivals ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </button>

                {/* NEW ARRIVALS DROPDOWN */}
                <motion.div
                  initial={false}
                  animate={{
                    height: mobileDropdowns.newArrivals ? 'auto' : 0,
                    opacity: mobileDropdowns.newArrivals ? 1 : 0,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pl-4 space-y-3 backdrop-blur-md bg-white/90">
                    <Link
                      href="/hoodies"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      HOODIES
                    </Link>
                    <Link
                      href="/jerseys"
                      className="block text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                      }}
                    >
                      JERSEYS
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Service/Account Links Section */}
            <div className="px-6 pb-6 space-y-4">
              <Link
                href="/account"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
        >
                ACCOUNT
              </Link>

              <Link
                href="/contact"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
              >
                CONTACT
              </Link>

          <Link
                href="/client-services"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
          >
                CLIENT SERVICES
          </Link>

          <Link
                href="/legal"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
          >
                LEGAL NOTICES
          </Link>

          <Link
                href="/supply-chains-act"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
          >
                SUPPLY CHAINS ACT
          </Link>

            <Link
                href="/social"
                className="block sog-link uppercase text-black hover:opacity-60 transition-opacity"
                onClick={() => {
                  setMobileOpen(false)
                  setMobileDropdowns({ featured: false, collections: false, newArrivals: false })
                }}
              >
                SOCIAL
            </Link>
          </div>
        </motion.div>
        </>
      )}
    </>
  )
}
