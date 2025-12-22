"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const presenceProducts: Product[] = [
  {
    id: "presence-1",
    name: "Presence Essential Tee",
    price: 95,
    image: "/presence/shirt-black.png",
    category: "Presence",
    description: "Core essential tee from the Presence collection",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Cream"],
  },
  {
    id: "presence-2",
    name: "Presence Hoodie",
    price: 185,
    image: "/presence/shirt-pink.png",
    category: "Presence",
    description: "Premium hoodie with Presence branding",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "presence-3",
    name: "Presence Sweatpants",
    price: 165,
    image: "/presence/ddd.jpg",
    category: "Presence",
    description: "Comfortable sweatpants from Presence line",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray"],
  },
  {
    id: "presence-4",
    name: "Presence Long Sleeve",
    price: 125,
    image: "/presence/fff.jpg",
    category: "Presence",
    description: "Long sleeve shirt with minimal design",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Cream"],
  },
  {
    id: "presence-5",
    name: "Presence Shorts",
    price: 105,
    image: "/presence/shirt-white.png",
    category: "Presence",
    description: "Athletic shorts from Presence collection",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "presence-6",
    name: "Presence Crewneck",
    price: 145,
    image: "/presence/SOG_30.jpg",
    category: "Presence",
    description: "Classic crewneck sweater",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Cream"],
  },
]

export default function PresencePage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">PRESENCE</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Core essentials collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {presenceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

