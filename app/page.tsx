import Navbar from "./components/navbar"
import FeaturedCollection from "./components/featured-collection"
import Hero from "./components/hero"
import NewCollection from "./components/new-collection"
import Footer from "./components/footer"

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <FeaturedCollection />
      <Hero />
      <NewCollection />
      <Footer />
    </main>
  )
}
