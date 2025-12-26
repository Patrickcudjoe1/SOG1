"use client"

import Navbar from "../components/navbar"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { useAuth } from "../components/AuthProvider"
import ProfileSection from "./components/ProfileSection"
import AddressSection from "./components/AddressSection"
import OrderHistory from "./components/OrderHistory"
import SignOutButton from "./components/SignOutButton"
import NotSignedInView from "./components/NotSignedInView"

export default function Account() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Navbar />
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Navbar />
        <NotSignedInView />
      </main>
    )
  }

  const userId = user.uid
  const userName = user.displayName || ''
  const userEmail = user.email || ''

  return (
    <ProtectedRoute>
      <main className="w-full min-h-screen bg-white">
        <Navbar />
        <section className="w-full py-16 md:py-20 px-6 md:px-12 pt-20 md:pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h1 
                className="text-3xl md:text-4xl font-light tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
              >
                Account Details
              </h1>
              <SignOutButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <ProfileSection
                  userId={userId}
                  initialName={userName}
                  initialEmail={userEmail}
                />
              </div>

              <div>
                <OrderHistory userId={userId} />
              </div>
            </div>

            <div className="mt-12">
              <AddressSection userId={userId} />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
}
