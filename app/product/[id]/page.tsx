"use client"

import { useParams } from "next/navigation"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import ProductDetail from "../../components/product-detail"
import { products } from "../../lib/products"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <main className="w-full">
        <Navbar />
        <section className="w-full py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-light tracking-wide mb-4">Product Not Found</h1>
            <p className="text-sm font-light text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full">
      <Navbar />

      {/* Breadcrumb */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-xs font-light tracking-wide">
            <a href="/shop" className="hover:opacity-60 transition-opacity">
              SHOP
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.category}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="w-full py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ProductDetail product={product} />
        </div>
      </section>

      {/* Related Products */}
      <section className="w-full border-t border-gray-200 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-light tracking-wide mb-12">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {products
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <a key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="group">
                  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden mb-4">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-2">
                    {relatedProduct.category}
                  </p>
                  <h3 className="text-sm tracking-wide font-light mb-2">{relatedProduct.name}</h3>
                  <p className="text-sm font-light">${relatedProduct.price}</p>
                </a>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
