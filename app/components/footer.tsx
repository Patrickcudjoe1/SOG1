"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [openTabs, setOpenTabs] = useState({
    clientServices: false,
    legalNotices: false,
    socials: false,
  })

  const toggleTab = (tab: 'clientServices' | 'legalNotices' | 'socials') => {
    setOpenTabs(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }))
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-white border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        {/* Newsletter Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-xs tracking-widest uppercase font-light mb-3">Join The Conversation</h3>
          <div className="flex items-center gap-4 max-w-md">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-transparent border-b border-gray-300 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
            />
            <button className="text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity">
              →
            </button>
          </div>
        </div>

        {/* Mobile Accordion Tabs */}
        <div className="md:hidden space-y-0 mb-6">
          {/* CLIENT SERVICES Tab */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleTab('clientServices')}
              className="w-full flex items-center justify-between py-4 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity"
            >
              <span>CLIENT SERVICES</span>
              {openTabs.clientServices ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </button>
            {openTabs.clientServices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-4"
              >
                <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light pl-0">
                  <Link href="/contact" className="hover:opacity-60 transition-opacity">
                    Contact
                  </Link>
                  <a href="#" className="hover:opacity-60 transition-opacity">
                    Services
                  </a>
                  <a
                    href="mailto:contact@sonofgod.com"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  >
                    <Mail size={14} /> Email
                  </a>
                  <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                    <Phone size={14} /> Phone
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                    <MapPin size={14} /> Location
                  </a>
                  <button className="text-left hover:opacity-60 transition-opacity">GHS ₵</button>
                </div>
              </motion.div>
            )}
          </div>

          {/* LEGAL NOTICES SUPPLY CHAIN ACT Tab */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleTab('legalNotices')}
              className="w-full flex items-center justify-between py-4 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity"
            >
              <span>LEGAL NOTICES SUPPLY CHAIN ACT</span>
              {openTabs.legalNotices ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </button>
            {openTabs.legalNotices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-4"
              >
                <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light pl-0">
                  <Link href="/terms" className="hover:opacity-60 transition-opacity">
                    Terms & Services
                  </Link>
                  <Link href="/privacy" className="hover:opacity-60 transition-opacity">
                    Privacy Policy
                  </Link>
                  <a href="#" className="hover:opacity-60 transition-opacity">
                    Supply Chain Act
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* THE SOCIALS Tab */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleTab('socials')}
              className="w-full flex items-center justify-between py-4 text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity"
            >
              <span>THE SOCIALS</span>
              {openTabs.socials ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </button>
            {openTabs.socials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-4"
              >
                <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light pl-0">
                  <a 
                    href="https://www.instagram.com/sonofgod_world/?__pwa=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-60 transition-opacity"
                  >
                    Instagram
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-60 transition-opacity"
                  >
                    Twitter
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-60 transition-opacity"
                  >
                    Facebook
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desktop Links Section */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <Link href="/shop" className="hover:opacity-60 transition-opacity">
              Shop
            </Link>
            <Link href="/gallery" className="hover:opacity-60 transition-opacity">
              Gallery
            </Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity">
              About
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <button className="text-left hover:opacity-60 transition-opacity">GHS ₵</button>
            <Link href="/contact" className="hover:opacity-60 transition-opacity">
              Contact
            </Link>
            <a href="#" className="hover:opacity-60 transition-opacity">
              Services
            </a>
            <a
              href="mailto:contact@sonofgod.com"
              className="flex items-center gap-2 hover:opacity-60 transition-opacity"
            >
              <Mail size={14} /> Email
            </a>
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
              <Phone size={14} /> Phone
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
              <MapPin size={14} /> Location
            </a>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <Link href="/terms" className="hover:opacity-60 transition-opacity">
              Terms & Services
            </Link>
            <Link href="/privacy" className="hover:opacity-60 transition-opacity">
              Privacy Policy
            </Link>
            <a href="#" className="hover:opacity-60 transition-opacity">
              Supply Chain Act
            </a>
          </div>

          <div className="flex flex-col gap-3 text-xs tracking-widest uppercase font-light">
            <a 
              href="https://www.instagram.com/sonofgod_world/?__pwa=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              Instagram
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              Twitter
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
          <p>© 2025 SON OF GOD. All rights reserved. Walk in faith. Wear your purpose.</p>
        </div>
      </div>
    </motion.footer>
  )
}
