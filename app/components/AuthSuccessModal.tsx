"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthSuccessModalProps {
  isOpen: boolean
  type: 'signup' | 'login'
  userName?: string
  onClose?: () => void
  redirectTo?: string
}

export default function AuthSuccessModal({ 
  isOpen, 
  type, 
  userName,
  onClose,
  redirectTo = '/'
}: AuthSuccessModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!isOpen) return

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Separate effect for redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isOpen) {
      handleRedirect()
    }
  }, [countdown, isOpen, redirectTo])

  const handleRedirect = () => {
    // Close modal and redirect using setTimeout to avoid React warning
    setTimeout(() => {
      router.replace(redirectTo)
      if (onClose) {
        onClose()
      }
    }, 0)
  }

  const getMessage = () => {
    if (type === 'signup') {
      return {
        title: 'Account Created Successfully! 🎉',
        message: userName 
          ? `Welcome, ${userName}! You're now logged in and ready to start shopping.`
          : "You're now logged in and ready to start shopping."
      }
    }
    return {
      title: 'Welcome Back! 👋',
      message: userName
        ? `Hi ${userName}, you're now logged in. Let's get shopping!`
        : "You're now logged in. Let's get shopping!"
    }
  }

  const { title, message } = getMessage()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleRedirect}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Success Icon */}
            <div className="relative pt-12 pb-8 px-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-base leading-relaxed"
              >
                {message}
              </motion.p>

              {/* Countdown */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-gray-500"
              >
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </motion.p>
            </div>

            {/* Action Buttons */}
            <div className="px-8 pb-8 space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleRedirect}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => {
                  router.replace('/account')
                  // Defer onClose to avoid React state update warning
                  if (onClose) {
                    setTimeout(() => onClose(), 0)
                  }
                }}
                className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Go to Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}