"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const capsProducts: Product[] = [
  {
    id: "cap-1",
    name: "SOG CAP-BROWN",
    price: 65,
    image: "/caps/cap-a.png",
    category: "Caps",
    description: "Premium cotton cap with embroidered logo",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Cream"],
  },
  {
    id: "cap-2",
    name: "SOG CAP-BLACK",
    price: 75,
    image: "/caps/cap-bl.png",
    category: "Caps",
    description: "Clean design snapback cap",
    sizes: ["One Size"],
    colors: ["Black", "Gray"],
  },
  {
    id: "cap-3",
    name: "SOG CAP-GREEN",
    price: 70,
    image: "/caps/cap-g.png",
    category: "Caps",
    description: "Classic baseball cap with premium materials",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "White"],
  },
  {
    id: "cap-4",
    name: "SOG CAP-PINK",
    price: 80,
    image: "/caps/cap-p.png",
    category: "Caps",
    description: "Structured cap with modern silhouette",
    sizes: ["One Size"],
    colors: ["Black", "Charcoal"],
  },
  {
    id: "cap-5",
    name: "SOG CAP-RED",
    price: 68,
    image: "/caps/cap-r.png",
    category: "Caps",
    description: "Five-panel design with subtle branding",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Cream"],
  },
  {
    id: "cap-6",
    name: "SOG CAP-BLUE",
    price: 95,
    image: "/caps/cap-m.png",
    category: "Caps",
    description: "Luxury wool cap for elevated style",
    sizes: ["One Size"],
    colors: ["Black", "Charcoal", "Navy"],
  },
]

export default function CapsPage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">CAPS</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Premium headwear collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {capsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

