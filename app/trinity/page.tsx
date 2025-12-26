"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const trinityProducts: Product[] = [
  {
    id: "trinity-1",
    name: "Trinity Logo Tee",
    price: 110,
    image: "/trinity/trinity-1.png",
    category: "Trinity",
    description: "Signature Trinity collection t-shirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
  },
  {
    id: "trinity-2",
    name: "Trinity Track Jacket",
    price: 225,
    image: "/trinity/trinity-2.png",
    category: "Trinity",
    description: "Athletic track jacket from Trinity line",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
  },
  {
    id: "trinity-3",
    name: "Trinity Joggers",
    price: 175,
    image: "/trinity/trinity-3.png",
    category: "Trinity",
    description: "Premium joggers with Trinity branding",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray"],
  },
  {
    id: "trinity-4",
    name: "Trinity Pullover",
    price: 195,
    image: "/trinity/trinity-4.png",
    category: "Trinity",
    description: "Comfortable pullover from Trinity collection",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Cream"],
  },
  {
    id: "trinity-5",
    name: "Trinity Windbreaker",
    price: 245,
    image: "/trinity/trinity-5.png",
    category: "Trinity",
    description: "Lightweight windbreaker jacket",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy"],
  },
  {
    id: "trinity-6",
    name: "Trinity Sweatshirt",
    price: 165,
    image: "/trinity/trinity-6.png",
    category: "Trinity",
    description: "Classic sweatshirt with Trinity design",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Cream"],
  },
]

export default function TrinityPage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">TRINITY</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Athletic-inspired collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {trinityProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

