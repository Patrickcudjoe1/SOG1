import dynamic from "next/dynamic"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

// Dynamically import heavy components with animations
const FeaturedCollection = dynamic(() => import("./components/featured-collection"), {
  loading: () => <div className="w-full h-screen bg-gray-100" />,
  ssr: true,
})

const Hero = dynamic(() => import("./components/hero"), {
  loading: () => <div className="w-full min-h-screen bg-gray-50" />,
  ssr: true,
})

const NewCollection = dynamic(() => import("./components/new-collection"), {
  loading: () => <div className="w-full h-screen bg-gray-100" />,
  ssr: true,
})

export default function Home() {
  return (
    <main className="w-full">
      <Navbar hasHeroSection={true} />
      <FeaturedCollection />
      <Hero />
      <NewCollection />
      <Footer />
    </main>
  )
}
