"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        {/* Newsletter Section */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs tracking-widest uppercase font-light mb-3 dark:text-gray-200">Join The Conversation</h3>
          <div className="flex items-center gap-4 max-w-md">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-transparent border-b border-border py-1.5 text-sm placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors text-foreground"
            />
            <button className="text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none text-foreground">
              →
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <Link href="/shop" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Shop
            </Link>
            <Link href="/gallery" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Gallery
            </Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              About
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <button className="text-left hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">GHS ₵</button>
            <Link href="/contact" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Contact
            </Link>
            <a href="#" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Services
            </a>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <Link href="/terms" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Terms & Services
            </Link>
            <Link href="/privacy" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Privacy Policy
            </Link>
            <a href="https://www.instagram.com/sonofgod_world/?__pwa=1" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Instagram
            </a>
            <a href="#" className="hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              Twitter
            </a>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <a
              href="mailto:contact@sonofgod.com"
              className="flex items-center gap-2 hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Mail size={14} /> Email
            </a>
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <Phone size={14} /> Phone
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <MapPin size={14} /> Location
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
          <p>© 2025 SON OF GOD. All rights reserved. Walk in faith. Wear your purpose.</p>
        </div>
      </div>
    </motion.footer>
  )
}
