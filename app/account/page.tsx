import Navbar from "../components/navbar"
import Footer from "../components/footer"
import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { getSession } from "../lib/auth"

export default async function Account() {
  const session = await getSession()

  if (!session?.user) {
    return (
      <main className="w-full">
        <Navbar />
        <section className="w-full min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <User size={64} className="mx-auto mb-8 opacity-50" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Your Account</h1>
            <p className="text-sm font-light text-gray-600 mb-8">
              Sign in to view your account details and order history
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/signin" className="inline-block btn-outline py-4">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-block text-xs tracking-widest uppercase font-light hover:opacity-60"
              >
                Create an Account
              </Link>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-12">Account Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm font-light tracking-widest uppercase mb-4">Profile Information</h2>
              <div className="space-y-4 border-b border-gray-200 pb-8">
                <div>
                  <p className="text-xs text-gray-600 tracking-widest uppercase">Name</p>
                  <p className="text-sm font-light">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 tracking-widest uppercase">Email</p>
                  <p className="text-sm font-light">{session.user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-light tracking-widest uppercase mb-4">Order History</h2>
              <div className="text-sm font-light text-gray-600">No orders yet</div>
            </div>
          </div>

          <Link href="/api/auth/signout" className="inline-block mt-12">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60">
              <LogOut size={16} /> Sign Out
            </div>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
