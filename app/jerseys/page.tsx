"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const jerseysProducts: Product[] = [
  {
    id: "jersey-1",
    name: "jersey-gold-dark",
    price: 125,
    image: "/jerseys/jersey-1.jpg",
    category: "Jerseys",
    description: "Authentic basketball jersey design",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    
  },
  {
    id: "jersey-2",
    name: "jersey-gold-light",
    price: 95,
    image: "/jerseys/jersey-2.jpg",
    category: "Jerseys",
    description: "Breathable mesh training jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
   
  },
  {
    id: "jersey-3",
    name: "jersey-green",
    price: 135,
    image: "/jerseys/jersey-3.jpg",
    category: "Jerseys",
    description: "Retro-inspired vintage jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
   
  },
  {
    id: "jersey-4",
    name: "jersey-wine",
    price: 115,
    image: "/jerseys/jersey-4.jpg",
    category: "Jerseys",
    description: "High-performance athletic jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    
  },
  
]

export default function JerseysPage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">JERSEYS</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Athletic jersey collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {jerseysProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

