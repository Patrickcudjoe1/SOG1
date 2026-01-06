"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { signInWithEmail } from "@/app/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmail(email, password)
      
      // Force refresh token to ensure it's fresh and not expired
      const idToken = await userCredential.user.getIdToken(true)

      // Verify admin access with server
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Signin failed:', {
          status: response.status,
          error: data.error,
          data
        })
        setError(data.error || "Invalid credentials")
        return
      }

      // Check if user is admin
      console.log('🔍 Checking admin status...')
      const adminCheckResponse = await fetch("/api/admin/check")
      const adminData = await adminCheckResponse.json()
      
      console.log('📥 Admin check response:', adminData)
      console.log('📊 Response structure check:', {
        success: adminData.success,
        hasData: !!adminData.data,
        isAdmin: adminData.data?.isAdmin,
        isSuperAdmin: adminData.data?.isSuperAdmin,
      })

      // API response wraps data in 'data' property
      if (!adminData.success || !adminData.data?.isAdmin) {
        console.error('❌ Admin check failed. Full response:', JSON.stringify(adminData, null, 2))
        setError("Access denied. Admin privileges required.")
        return
      }

      console.log('✅ Admin check passed! Redirecting to dashboard...')
      // Redirect to admin dashboard
      window.location.href = "/admin"
    } catch (err: any) {
      console.error("Admin login error:", err)
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/20 bg-white shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-8">
            {/* Logo Image */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-4"
            >
              <div className="relative w-32 h-20 md:w-40 md:h-24">
                <Image
                  src="/logo.png"
                  alt="SON OF GOD Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-black">SOG Admin Portal</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Sign in to access the admin dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2"
                >
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock size={18} />
                    Sign In to Admin Portal
                  </span>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p className="font-medium text-black mb-1">Secure Admin Access</p>
                  <p>
                    This portal is restricted to authorized administrators only. 
                    All login attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} Admin Portal. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}