"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin?reset=true");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Navbar  />
        <section className="w-full min-h-[80vh] flex items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
              Invalid reset link. Please request a new password reset.
            </div>
            <Link href="/forgot-password" className="inline-block btn-outline">
              Request New Reset Link
            </Link>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  if (success) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Navbar  />
        <section className="w-full min-h-[80vh] flex items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <CheckCircle size={48} className="mx-auto mb-6 text-green-600" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Password Reset</h1>
            <p className="text-sm font-light text-gray-600 mb-8">
              Your password has been reset successfully. Redirecting to sign in...
            </p>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar  />
      <section className="w-full min-h-[80vh] flex items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-light text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          <div className="text-center mb-8">
            <Lock size={48} className="mx-auto mb-6 opacity-50" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Reset Password</h1>
            <p className="text-sm font-light text-gray-600">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2 text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-12 border border-gray-200 text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2 text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-12 border border-gray-200 text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-xs tracking-widest uppercase font-light disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-brand)" }}
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

