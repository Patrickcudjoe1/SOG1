"use client"

import Image from "next/image"
import { useState } from "react"
import type { Product } from "@/app/lib/products"
import { useCart } from './CartContext'
import { formatCurrency } from "@/app/lib/currency"

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      {/* Product Image */}
      <div className="flex items-center justify-center bg-gray-50">
        <Image
          src={product.image || "/SOG1.jpg"}
          alt={product.name}
          width={500}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-start space-y-8">
        <div>
          <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-2">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">{product.name}</h1>
          <p className="text-lg font-light">{formatCurrency(product.price)}</p>
        </div>

        <p className="text-sm font-light leading-relaxed text-gray-700">{product.description}</p>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <p className="text-xs tracking-widest uppercase font-light mb-4">
              Color: {product.colors.length === 1 ? product.colors[0] : selectedColor}
            </p>
            {product.colors.length > 1 && (
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 border-2 transition-all ${
                      selectedColor === color ? "border-black" : "border-gray-300 hover:border-gray-500"
                    }`}
                    title={color}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === "black"
                          ? "#000000"
                          : color.toLowerCase() === "white"
                            ? "#ffffff"
                            : color.toLowerCase() === "gray"
                              ? "#d1d5db"
                              : color.toLowerCase() === "cream"
                                ? "#fef3c7"
                                : color.toLowerCase() === "charcoal"
                                  ? "#36454f"
                                  : color.toLowerCase() === "pink"
                                    ? "#ec4899"
                                    : color.toLowerCase() === "orange"
                                      ? "#f97316"
                                      : color.toLowerCase() === "brown"
                                        ? "#92400e"
                                        : color.toLowerCase() === "gold"
                                          ? "#fbbf24"
                                          : color.toLowerCase() === "green"
                                            ? "#10b981"
                                            : color.toLowerCase() === "red"
                                              ? "#ef4444"
                                              : color.toLowerCase() === "navy"
                                                ? "#1e3a8a"
                                                : color.toLowerCase() === "blue"
                                                  ? "#3b82f6"
                                                  : "#f5f5f5",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p className="text-xs tracking-widest uppercase font-light mb-4">Size: {selectedSize || "Select Size"}</p>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border text-xs tracking-widest uppercase font-light transition-all ${
                    selectedSize === size ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <p className="text-xs tracking-widest uppercase font-light mb-4">Quantity</p>
          <div className="flex items-center gap-4 border border-gray-300 w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-4 py-2 text-sm font-light">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="btn-outline w-full md:w-auto"
          onClick={() => {
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
              alert("Please select a size")
              return
            }
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              size: selectedSize || undefined,
              color: selectedColor || undefined,
              quantity: quantity,
              productId: product.id,
            })
            alert("Item added to cart!")
          }}
        >
          Add to Cart
        </button>

        {/* Product Details */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <div>
            <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-2">Shipping & Returns</p>
            <p className="text-sm font-light text-gray-700">
              Free shipping on orders over ₵100. Easy returns within 30 days.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-2">Material</p>
            <p className="text-sm font-light text-gray-700">Premium quality materials sourced responsibly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

