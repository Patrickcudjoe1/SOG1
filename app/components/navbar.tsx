"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Search, User, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      return window.innerWidth < 768
    }

    const updateScrollState = () => {
      const mobile = checkMobile()
      setIsMobile(mobile)

      // For mobile: always show solid navbar on all pages
      // For desktop: transparent on home page only, solid on other pages
      if (!isHomePage || mobile) {
        setScrolled(true)
      } else {
        // Desktop home page: check scroll position
        setScrolled(window.scrollY > 50)
      }
    }

    // Initial check
    updateScrollState()

    // For non-home pages, just listen to resize
    if (!isHomePage) {
      const handleResize = () => {
        const mobile = checkMobile()
        setIsMobile(mobile)
        setScrolled(true)
      }
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }

    // Home page: listen to both scroll and resize
    const handleScroll = () => {
      const mobile = checkMobile()
      if (mobile) {
        setScrolled(true) // Mobile always solid
      } else {
        setScrolled(window.scrollY > 50) // Desktop: scroll-based
      }
    }

    const handleResize = () => {
      updateScrollState()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [isHomePage])

  return (
    <>
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled || !isHomePage || isMobile
            ? "bg-white border-b border-gray-200 fixed top-0 shadow-sm"
            : "bg-transparent absolute top-0"
        } z-50`}
      >
        <div className="max-w-full px-6 md:px-12 py-4">
          <div className="flex items-center justify-center relative h-10">
            {/* Left Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-12 absolute left-0">
              <Link
                href="/"
                className={`link-underline transition-colors duration-300 ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                SON OF GOD
              </Link>
              <Link
                href="/shop"
                className={`link-underline transition-colors duration-300 ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                COLLECTIONS
              </Link>
              <Link
                href="/new-arrivals"
                className={`link-underline transition-colors duration-300 ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                NEW ARRIVALS
              </Link>
            </div>

            {/* Mobile Menu Button - Left Side */}
            <button
              className={`md:hidden absolute left-0 p-2 transition-colors duration-300 ${
                scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Center Brand - Desktop & Mobile */}
            <Link
              href="/"
              className={`text-xl md:text-3xl tracking-widest uppercase font-bold transition-colors duration-300 ${
                scrolled || !isHomePage ? "text-black" : "text-white"
              }`}
            >
              SON OF GOD
            </Link>

            {/* Right Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-6 absolute right-0">
              <Link
                href="/search"
                className={`p-2 hover:opacity-60 transition-opacity ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                <Search size={18} />
              </Link>
              <Link
                href="/account"
                className={`p-2 hover:opacity-60 transition-opacity ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                <User size={18} />
              </Link>
              <Link
                href="/cart"
                className={`p-2 hover:opacity-60 transition-opacity ${
                  scrolled || !isHomePage ? "text-black" : "text-white"
                }`}
              >
                <ShoppingBag size={18} />
              </Link>
            </div>

            {/* Mobile Right Navigation - Search and Cart */}
            <div className="md:hidden absolute right-0 flex items-center gap-3">
              <Link
                href="/search"
                className={`p-2 hover:opacity-60 transition-opacity ${
                  scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
                }`}
              >
                <Search size={18} />
              </Link>
              <Link
                href="/cart"
                className={`p-2 hover:opacity-60 transition-opacity ${
                  scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
                }`}
              >
                <ShoppingBag size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`md:hidden fixed top-[66px] left-0 right-0 z-40 ${
            scrolled || !isHomePage || isMobile
              ? "bg-white border-b border-gray-200"
              : "bg-black/90 backdrop-blur-sm"
          } px-6 py-4 space-y-4 transition-colors duration-300 shadow-lg`}
        >
          <Link
            href="/"
            className={`block text-xs tracking-widest uppercase font-light hover:opacity-60 transition-colors cursor-pointer ${
              scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            SON OF GOD
          </Link>
          <Link
            href="/shop"
            className={`block text-xs tracking-widest uppercase font-light hover:opacity-60 transition-colors cursor-pointer ${
              scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            COLLECTIONS
          </Link>
          <Link
            href="/new-arrivals"
            className={`block text-xs tracking-widest uppercase font-light hover:opacity-60 transition-colors cursor-pointer ${
              scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            NEW ARRIVALS
          </Link>
          <div
            className={`flex gap-4 pt-4 ${
              scrolled || !isHomePage || isMobile ? "border-t border-gray-200" : "border-t border-white/20"
            }`}
          >
            <Link
              href="/account"
              className={`p-2 hover:opacity-60 transition-opacity cursor-pointer ${
                scrolled || !isHomePage || isMobile ? "text-black" : "text-white"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <User size={18} />
            </Link>
          </div>
        </motion.div>
      )}
    </>
  )
}
