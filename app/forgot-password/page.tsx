"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <Mail size={48} className="mx-auto mb-6 opacity-50" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Forgot Password</h1>
            <p className="text-sm font-light text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
                If an account exists with this email, a password reset link has been sent. Please check your inbox.
              </div>
              <Link href="/signin" className="inline-block btn-outline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-xs tracking-widest uppercase font-light mb-2 text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-xs tracking-widest uppercase font-light disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          )}
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

