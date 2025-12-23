import Link from "next/link"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"

export default function ProductNotFound() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Main Content - Centered */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-wide">
            PRODUCT NOT FOUND
          </h1>
          <p className="text-sm md:text-base font-light text-gray-600">
            The product you're looking for doesn't exist.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 border border-gray-900 bg-white text-gray-900 text-xs tracking-widest uppercase font-light hover:bg-gray-50 transition-colors"
            >
              BACK TO SHOP
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
