"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/app/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Phone } from "lucide-react"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Mobile number authentication state
  const [phone, setPhone] = useState("")
  const [phoneName, setPhoneName] = useState("")
  const [otp, setOtp] = useState("")
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone")
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  
  const router = useRouter()
  const supabase = createClient()

  // Format phone number (add country code if needed)
  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length > 0 && !phone.startsWith("+")) {
      if (digits.startsWith("0")) {
        return `+233${digits.slice(1)}`
      }
      if (!digits.startsWith("233")) {
        return `+233${digits}`
      }
      return `+${digits}`
    }
    return phone.startsWith("+") ? phone : `+${digits}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      })

      if (signUpError) {
        // Provide more specific error messages
        if (signUpError.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.")
        } else if (signUpError.message.includes("Password")) {
          setError(signUpError.message)
        } else {
          setError(signUpError.message || "Failed to create account")
        }
        console.error("Sign up error:", signUpError)
        return
      }

      if (data.user) {
        // If session exists, user is automatically signed in (email confirmation disabled)
        if (data.session) {
          // User is signed in - redirect to home or account page
          router.push("/")
          return
        }
        
        // If no session but user created, try to sign in immediately
        // This works if email confirmation is disabled in Supabase
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) {
          // If sign in fails, email confirmation might be required
          // Redirect to sign in page with message
          router.push("/signin?registered=true&confirm=email")
        } else if (signInData.session) {
          // Successfully signed in - redirect to home
          router.push("/")
        } else {
          // Fallback - redirect to sign in
          router.push("/signin?registered=true")
        }
      }
    } catch (err: any) {
      console.error("Sign up exception:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
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
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 min-h-[48px]"
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 min-h-[48px]"
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

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Confirm Password*"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 sm:py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6 min-h-[48px]"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Mobile Number Authentication */}
          <div className="space-y-4 mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-500">Or sign up with mobile number</span>
              </div>
            </div>

            {phoneStep === "phone" ? (
              <form onSubmit={async (e) => {
                e.preventDefault()
                setPhoneError("")
                setPhoneLoading(true)

                try {
                  const formattedPhone = formatPhoneNumber(phone)
                  
                  const { error: otpError } = await supabase.auth.signInWithOtp({
                    phone: formattedPhone,
                    options: {
                      data: {
                        name: phoneName,
                      },
                    },
                  })

                  if (otpError) {
                    setPhoneError(otpError.message || "Failed to send OTP. Please try again.")
                    console.error("OTP send error:", otpError)
                  } else {
                    setPhoneStep("otp")
                  }
                } catch (err: any) {
                  console.error("Send OTP exception:", err)
                  setPhoneError(err.message || "An error occurred. Please try again.")
                } finally {
                  setPhoneLoading(false)
                }
              }} className="space-y-4">
                {phoneError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded"
                  >
                    {phoneError}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={phoneName}
                    onChange={(e) => setPhoneName(e.target.value)}
                    required
                    className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 min-h-[48px]"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400"
                      placeholder="0244123456 or +233244123456"
                    />
                  </div>
                  <p className="text-xs text-gray-500">We'll send you a verification code via SMS</p>
                </div>

                <button
                  type="submit"
                  disabled={phoneLoading}
                  className="w-full px-6 py-3.5 sm:py-4 border border-black text-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {phoneLoading ? "Sending..." : (
                    <>
                      <Phone size={18} />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault()
                setPhoneError("")
                setPhoneLoading(true)

                try {
                  const formattedPhone = formatPhoneNumber(phone)
                  
                  const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    phone: formattedPhone,
                    token: otp,
                    type: "sms",
                  })

                  if (verifyError) {
                    if (verifyError.message.includes("Invalid")) {
                      setPhoneError("Invalid OTP code. Please check and try again.")
                    } else {
                      setPhoneError(verifyError.message || "Failed to verify OTP. Please try again.")
                    }
                    console.error("OTP verify error:", verifyError)
                  } else if (data.user) {
                    router.push("/")
                  }
                } catch (err: any) {
                  console.error("Verify OTP exception:", err)
                  setPhoneError(err.message || "An error occurred. Please try again.")
                } finally {
                  setPhoneLoading(false)
                }
              }} className="space-y-4">
                {phoneError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded"
                  >
                    {phoneError}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="block">Enter verification code sent to</span>
                    <span className="block truncate font-semibold mt-1">{phone}</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-lg sm:text-xl md:text-2xl bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 placeholder:text-gray-400 text-center tracking-[0.5em] font-mono"
                    placeholder="000000"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneStep("phone")
                        setOtp("")
                        setPhoneError("")
                      }}
                      className="text-black underline hover:text-gray-600"
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={phoneLoading || otp.length !== 6}
                  className="w-full px-6 py-3.5 sm:py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                >
                  {phoneLoading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>
            )}
          </div>

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
  )
}
