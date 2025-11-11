"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { Product } from "@/app/lib/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Product Image */}
        <div
          className="relative w-full aspect-square bg-gray-100 overflow-hidden mb-3 md:mb-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-1 md:space-y-2">
          <p className="text-xs tracking-widest uppercase font-light text-gray-600">{product.category}</p>
          <h3 className="text-xs md:text-sm tracking-wide font-light leading-tight">{product.name}</h3>
          <p className="text-xs md:text-sm font-light">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
