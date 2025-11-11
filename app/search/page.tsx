"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import { products } from "../lib/products"
import { useState } from "react"
import { SearchIcon } from "lucide-react"

export default function Search() {
  const [query, setQuery] = useState("")

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase text-center mb-8">Search</h1>

          <div className="flex items-center gap-4 max-w-md mx-auto">
            <SearchIcon size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-b border-gray-300 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
              autoFocus
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {results.length > 0 ? (
            <>
              <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-12">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm font-light text-gray-600">
                {query ? "No products found matching your search" : "Enter a search term to get started"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
