"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { createClient } from "@/app/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import { SocialProviders } from "../account/components/SocialProviders"

function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Provide more specific error messages
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please check your email and confirm your account before signing in.")
        } else if (signInError.message.includes("User not found")) {
          setError("No account found with this email. Please sign up first.")
        } else {
          setError(signInError.message || "Invalid email or password")
        }
        console.error("Sign in error:", signInError)
      } else if (data.user) {
        const callbackUrl = searchParams.get("callbackUrl") || "/account"
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      console.error("Sign in exception:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Navbar forceDark={true} />

      <div className="flex-1 flex items-center justify-center p-8 md:p-12 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Sign in</h1>
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Password*"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
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
              className="w-full px-6 py-3.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Social Providers */}
          <div className="space-y-4 mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-500">Or continue with</span>
              </div>
            </div>
            <SocialProviders />
          </div>

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
