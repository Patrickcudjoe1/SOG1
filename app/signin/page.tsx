"use client"

import type React from "react"
import { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import { signInWithEmail } from "../lib/firebase/auth"
import { useAuth } from "../components/AuthProvider"
import AuthSuccessModal from "../components/AuthSuccessModal"

function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [userName, setUserName] = useState("")

  // Redirect to homepage if already authenticated (not to /account)
  useEffect(() => {
    if (user && !showSuccessModal) {
      router.replace("/")
    }
  }, [user, router, showSuccessModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await signInWithEmail(email, password)
      
      // Clear password field for security
      setPassword("")
      
      // Get user name for modal
      setUserName(userCredential.user.displayName || "")
      
      // Show success modal
      setShowSuccessModal(true)
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <>
      <AuthSuccessModal 
        isOpen={showSuccessModal}
        type="login"
        userName={userName}
        onClose={() => setShowSuccessModal(false)}
        redirectTo={callbackUrl}
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">Sign in</h1>
            {searchParams.get("registered") === "true" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded mt-4"
              >
                {searchParams.get("confirm") === "email" 
                  ? "Account created! Please check your email to confirm your account before signing in."
                  : "Account created successfully! You can now sign in."}
              </motion.div>
            )}
          </div>

          {/* Email/Password Form */}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e as any)
                    }
                  }}
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-black underline hover:text-gray-600 transition-colors"
              >
                Reset my password
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 sm:py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6 min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            New here?{" "}
            <Link href="/signup" className="text-black underline hover:text-gray-600 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
    </>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <main className="w-full min-h-screen bg-white flex flex-col">
        <Navbar forceDark={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    }>
      <SignInForm />
    </Suspense>
  )
}
