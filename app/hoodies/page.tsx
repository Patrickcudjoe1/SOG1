"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import type { Product } from "../lib/products"

const hoodiesProducts: Product[] = [
  {
    id: "hoodie-1",
    name: " HOODIE-BLACK",
    price: 155,
    image: "/hoodies/hoodie-1.jpg",
    category: "SON OF GOD ",
    description: "Essential pullover hoodie with premium cotton",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "hoodie-2",
    name: " HOODIE-WHITE",
    price: 175,
    image: "/hoodies/hoodie-2.jpg",
    category: "SON OF GOD ",
    description: "Versatile zip-up hoodie for everyday wear",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Cream"],
  },
  {
    id: "hoodie-3",
    name: " HOODIE-CREAM",
    price: 165,
    image: "/hoodies/hoodie-3.jpg",
    category: "SON OF GOD ",
    description: "Comfortable oversized fit hoodie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "hoodie-4",
    name: " HOODIE-NAVY",
    price: 145,
    image: "/hoodies/hoodie-4.jpg",
    category: "SON OF GOD ",
    description: "Modern crop-length hoodie",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Cream"],
  },
  {
    id: "hoodie-5",
    name: " HOODIE-PINK",
    price: 195,
    image: "/hoodies/hoodie-5.jpg",
    category: "SON OF GOD ",
    description: "Warm fleece-lined hoodie for cooler weather",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "hoodie-6",
    name: " HOODIE-GREEN",
    price: 160,
    image: "/hoodies/hoodie-6.jpg",
    category: "SON OF GOD ",
    description: "Clean design hoodie with minimal branding",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Cream", "Navy"],
  },
]

export default function HoodiesPage() {
  return (
    <main className="w-full">
      <Navbar />

      {/* Page Header */}
      <section className="w-full border-b border-gray-200 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4">HOODIES</h1>
          <p className="text-xs md:text-sm font-light text-gray-600 tracking-wide">Premium hoodie collection</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-16 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12 lg:gap-16">
            {hoodiesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

