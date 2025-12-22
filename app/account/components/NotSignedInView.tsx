"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NotSignedInView() {
  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
          {/* Logo Area - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            {/* Checkered Pattern Background with Logo */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 grid grid-cols-2 gap-0">
                <div className="bg-white"></div>
                <div className="bg-gray-200"></div>
                <div className="bg-gray-200"></div>
                <div className="bg-gray-300"></div>
              </div>
              {/* Logo Image */}
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Son of God Logo"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Content */}
      <section className="w-full lg:w-1/2 flex items-center justify-center py-16 md:py-24 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="inline-block relative w-20 h-20 mb-4">
              <div className="absolute inset-0 grid grid-cols-2 gap-0">
                <div className="bg-white"></div>
                <div className="bg-gray-200"></div>
                <div className="bg-gray-200"></div>
                <div className="bg-gray-300"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Son of God Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <User size={64} className="mx-auto mb-8 text-gray-300" />
          <h1 
            className="text-3xl md:text-4xl font-bold text-black mb-4"
          >
            Your Account
          </h1>
          <p className="text-sm text-gray-600 mb-10">
            Sign in to view your account details and order history
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              href="/signin" 
              className="inline-block px-8 py-3.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm font-medium text-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-block text-sm text-gray-600 hover:text-gray-800 transition-colors underline"
            >
              Create an Account
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
