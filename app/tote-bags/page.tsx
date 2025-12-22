"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const toteBagsProducts: Product[] = [
  {
    id: "tote-1",
    name: "Canvas Tote Bag",
    price: 95,
    image: "/tote/SOG_16.jpg",
    category: "Tote Bags",
    description: "Durable canvas tote with leather handles",
    sizes: ["One Size"],
    colors: ["Cream", "Black", "Navy"],
  },
  {
    id: "tote-2",
    name: "Minimalist Tote",
    price: 120,
    image: "/tote/SOG_17.jpg",
    category: "Tote Bags",
    description: "Clean design tote bag for everyday use",
    sizes: ["One Size"],
    colors: ["Black", "Gray"],
  },
  {
    id: "tote-3",
    name: "Leather Tote Bag",
    price: 285,
    image: "/tote/SOG_18.jpg",
    category: "Tote Bags",
    description: "Premium leather tote with structured design",
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
  },
  {
    id: "tote-4",
    name: "Oversized Tote",
    price: 135,
    image: "/tote/SOG_19.jpg",
    category: "Tote Bags",
    description: "Spacious tote bag for all your essentials",
    sizes: ["One Size"],
    colors: ["Black", "Cream", "Navy"],
  },
  {
    id: "tote-5",
    name: "Reversible Tote",
    price: 145,
    image: "/tote/SOG_20.jpg",
    category: "Tote Bags",
    description: "Versatile reversible tote bag",
    sizes: ["One Size"],
    colors: ["Black/Cream", "Navy/Gray"],
  },
  {
    id: "tote-6",
    name: "Premium Canvas Tote",
    price: 110,
    image: "/tote/SOG_16.jpg",
    category: "Tote Bags",
    description: "High-quality canvas tote with reinforced handles",
    sizes: ["One Size"],
    colors: ["Black", "Cream", "Navy"],
  },
]

export default function ToteBagsPage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">TOTE BAGS</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Functional and stylish tote collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {toteBagsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

