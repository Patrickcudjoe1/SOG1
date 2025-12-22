import Navbar from "../components/navbar"
import { getSession } from "../lib/auth"
import ProfileSection from "./components/ProfileSection"
import AddressSection from "./components/AddressSection"
import OrderHistory from "./components/OrderHistory"
import SignOutButton from "./components/SignOutButton"
import NotSignedInView from "./components/NotSignedInView"

// Revalidate account page every 60 seconds (user-specific data)
export const revalidate = 60

export default async function Account() {
  const session = await getSession()

  if (!session?.user) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Navbar forceDark={true} />
        <NotSignedInView />
      </main>
    )
  }

  const userId = session.user.id as string
  const userName = session.user.name
  const userEmail = session.user.email || ""

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <section className="w-full py-16 md:py-20 px-6 md:px-12">
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
  )
}
