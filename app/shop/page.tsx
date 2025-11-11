"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import { products } from "../lib/products"
import { useState } from "react"

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All"]
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <main className="w-full">
      <Navbar />

      {/* Shop Header */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">SHOP THE COLLECTION</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Curated pieces for the modern faithful</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
          <div className="flex gap-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs tracking-widest uppercase font-light transition-opacity ${
                  selectedCategory === category ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
