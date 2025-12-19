"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Search, User, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "./CartContext"

export default function SONOFGODNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useCart()

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`sog-nav fixed top-0 w-full z-50 transition-all duration-300
          ${scrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"}
        `}
      >
        <div className="max-w-full px-6 md:px-12 py-4 transition-all duration-300">
          <div className="flex items-center justify-center relative h-10">

            {/* LEFT NAV - DESKTOP */}
            <div className="hidden md:flex items-center gap-10 absolute left-0">
              <div className="relative group">
                {/* Large Blurry Backdrop Overlay - FEATURED */}
                <div
                  className={`fixed inset-0 z-40 pointer-events-none
                    opacity-0 invisible transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:visible
                    backdrop-blur-xl
                    ${scrolled ? "bg-white/30" : "bg-black/40"}
                  `}
                />
                
                {/* FEATURED BUTTON */}
                <Link
                  href="/"
                  className={`sog-link font-light uppercase transition-colors whitespace-nowrap relative z-50 ${
                    scrolled ? "text-black" : "text-white"
                  }`}
                >
                  FEATURED
                </Link>

                {/* FEATURED DROPDOWN */}
                <div
                  className={`absolute left-0 top-full mt-6 w-56 z-50
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 ease-out
                    backdrop-blur-md
                    ${scrolled ? "bg-white/90 text-black" : "bg-black/80 text-white"}
                  `}
                >
                  <div className="flex flex-col px-4 py-3 space-y-3 text-xs tracking-widest uppercase">
                    <Link href="/new-arrivals" className="hover:opacity-60">
                      NEW ARRIVALS
                    </Link>
                    <Link href="/collections/essentials-classic" className="hover:opacity-60">
                      ESSENTIALS CLASSIC STYLES
                    </Link>
                    <Link href="/collections/athletics" className="hover:opacity-60">
                      ATHLETICS & TEAM APPAREL
                    </Link>
                    <Link href="/collections/essentials" className="hover:opacity-60">
                      ESSENTIALS
                    </Link>
                    <Link href="/collections/fear-of-god" className="hover:opacity-60">
                      FEAR OF GOD
                    </Link>
                    <Link href="/collections/footwear" className="hover:opacity-60">
                      FOOTWEAR
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/shop"
                className={`sog-link font-light uppercase transition-colors whitespace-nowrap ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                SHOP
              </Link>
              
              <div className="relative group">
                {/* Large Blurry Backdrop Overlay - COLLECTIONS */}
                <div
                  className={`fixed inset-0 z-40 pointer-events-none
                    opacity-0 invisible transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:visible
                    backdrop-blur-xl
                    ${scrolled ? "bg-white/30" : "bg-black/40"}
                  `}
                />
                
                {/* COLLECTIONS BUTTON */}
                <Link
                  href="/shop"
                  className={`sog-link font-light uppercase transition-colors whitespace-nowrap relative z-50 ${
                    scrolled ? "text-black" : "text-white"
                  }`}
                >
                  COLLECTIONS
                </Link>

                {/* DROPDOWN */}
                <div
                  className={`absolute left-0 top-full mt-6 w-48 z-50
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 ease-out
                    backdrop-blur-md
                    ${scrolled ? "bg-white/90 text-black" : "bg-black/80 text-white"}
                  `}
                >
                  <div className="flex flex-col px-4 py-3 space-y-3 text-xs tracking-widest uppercase">
                    <Link href="/collections/fear-of-god" className="hover:opacity-60">
                      TOTE BAGS
                    </Link>
                    <Link href="/collections/essentials" className="hover:opacity-60">
                      PRESENCE
                    </Link>
                    <Link href="/collections/athletics" className="hover:opacity-60">
                      TRINITY
                    </Link>
                    <Link href="/collections/fear-of-god" className="hover:opacity-60">
                      CAPS
                    </Link>  
                    <Link href="/collections/fear-of-god" className="hover:opacity-60">
                      HOODY
                    </Link> 
                    <Link href="/collections/fear-of-god" className="hover:opacity-60">
                      JERSEY
                    </Link> 
                  </div>
                </div>
              </div>

              <Link
                href="/new-arrivals"
                className={`sog-link font-light uppercase transition-colors whitespace-nowrap ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                NEW ARRIVALS
              </Link>
            </div>

            {/* MOBILE HAMBURGER */}
            <button
              className={`md:hidden absolute left-0 p-2 transition-colors ${
                scrolled ? "text-black" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* CENTER LOGO */}
            <Link
              href="/"
              className={`text-lg md:text-xl font-bold uppercase tracking-[0.50em] transition-colors ${
                scrolled ? "text-black" : "text-white"
              }`}
              style={{ fontFamily: 'var(--font-brand)' }}
            >
              SON OF GOD
            </Link>

            {/* RIGHT NAV – DESKTOP */}
            <div className="hidden md:flex items-center gap-6 absolute right-0">
              <Link
                href="/search"
                className={`w-8 h-8 hover:opacity-60 transition-opacity flex items-center justify-center ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                <Search size={15} />
              </Link>

              <Link
                href="/account"
                className={`w-8 h-8 hover:opacity-60 transition-opacity flex items-center justify-center ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                <User size={15} />
              </Link>

              <Link
                href="/cart"
                className={`w-8 h-8 hover:opacity-60 relative transition-opacity flex items-center justify-center ${
                  scrolled ? "text-black" : "text-white"
                }`}
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
                className={`w-10 h-10 hover:opacity-60 flex items-center justify-center ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                <Search size={18} />
              </Link>

              <Link
                href="/cart"
                className={`w-10 h-10 hover:opacity-60 relative flex items-center justify-center ${
                  scrolled ? "text-black" : "text-white"
                }`}
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden fixed top-[66px] left-0 right-0 z-40 px-6 py-4 space-y-4 shadow-lg transition-colors
            ${scrolled ? "bg-white" : "bg-black"}
          `}
        >
          <Link
            href="/"
            className={`block sog-link font-semibold tracking-wider uppercase ${
              scrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            HOME
          </Link>

          <Link
            href="/shop"
            className={`block sog-link font-semibold tracking-wider uppercase ${
              scrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            COLLECTIONS
          </Link>

          <Link
            href="/new-arrivals"
            className={`block sog-link font-semibold tracking-wider uppercase ${
              scrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            NEW ARRIVALS
          </Link>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Link
              href="/account"
              className={`w-10 h-10 flex items-center justify-center ${scrolled ? "text-black" : "text-white"}`}
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
