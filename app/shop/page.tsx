"use client"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import ProductCard from "../components/product-card"
import { products } from "../lib/products"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filter products: only show those with valid images
  // Exclude products with empty, undefined, null, or placeholder images
  const productsWithImages = products.filter((p) => {
    if (!p.image) return false
    const imagePath = p.image.trim()
    if (imagePath === "") return false
    if (imagePath.includes("placeholder")) return false
    return true
  })
  
  // Dynamically extract unique categories from products with valid images
  const uniqueCategories = Array.from(
    new Set(productsWithImages.map((p) => p.category))
  ).sort()
  
  const categories = ["All", ...uniqueCategories]
  
  const filteredProducts =
    selectedCategory === "All" 
      ? productsWithImages 
      : productsWithImages.filter((p) => p.category === selectedCategory)

  return (
    <main className="w-full">
      <Navbar />

      {/* Shop Header */}
      <section className="w-full border-b border-border pt-20 md:pt-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide mb-3 md:mb-4 text-foreground">SHOP THE COLLECTION</h1>
          <p className="text-xs md:text-sm font-light text-muted-foreground tracking-wide">Curated pieces for the modern faithful</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
          <div className="relative inline-block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-foreground text-xs tracking-widest uppercase font-light hover:bg-foreground hover:text-background transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {selectedCategory}
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 z-50 bg-card border border-border min-w-[200px] shadow-lg">
                  <div className="flex flex-col">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsDropdownOpen(false)
                        }}
                        className={`text-left px-4 py-3 text-xs tracking-widest uppercase font-light transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                          selectedCategory === category 
                            ? "bg-foreground text-background" 
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
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
