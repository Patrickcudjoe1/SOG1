import Link from "next/link"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"

export default function ProductNotFound() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-light tracking-wide mb-4">Product Not Found</h1>
          <p className="text-sm font-light text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-xs tracking-widest uppercase font-light"
          >
            Back to Shop
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}

