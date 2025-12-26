"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import { signUpWithEmail } from "../lib/firebase/auth"
import { useAuth } from "../components/AuthProvider"
import AuthSuccessModal from "../components/AuthSuccessModal"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { user } = useAuth()

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Redirect to homepage if already authenticated (not to /account)
  useEffect(() => {
    if (user && !showSuccessModal) {
      router.replace("/")
    }
  }, [user, router, showSuccessModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!agreedToTerms) {
      setError("You must agree to the Terms & Services and Privacy Policy")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const userCredential = await signUpWithEmail(email, password, name)
      
      // Clear password fields for security
      setPassword("")
      setConfirmPassword("")
      
      // Show success modal
      setShowSuccessModal(true)
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <AuthSuccessModal 
        isOpen={showSuccessModal}
        type="signup"
        userName={name}
        onClose={() => setShowSuccessModal(false)}
      />
      
      <main className="w-full min-h-screen bg-white flex flex-col">
        <Navbar forceDark={true} />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 pt-20 sm:pt-24 md:pt-28 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded"
              >
                {error}
              </motion.div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("") // Clear error on input
                }}
                required
                disabled={loading}
                className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("") // Clear error on input
                }}
                required
                disabled={loading}
                className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("") // Clear error on input
                  }}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Password*"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError("") // Clear error on input
                  }}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm Password*"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms & Privacy Policy Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-black underline hover:text-gray-600 transition-colors">
                  Terms & Services
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-black underline hover:text-gray-600 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full px-6 py-3.5 sm:py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6 min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-black underline hover:text-gray-600 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
    </>
  )
}
