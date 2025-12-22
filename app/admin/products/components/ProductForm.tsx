"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ProductFormData {
  name: string
  description: string
  price: string
  image: string // Single image URL for now
  category: string
  subCategory: string
  sizes: string // Comma-separated sizes
  bestseller: boolean
  inStock: boolean
}

interface ProductFormProps {
  product?: any
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  "Essentials",
  "Caps",
  "Hoodies",
  "Jerseys",
  "Tote Bags",
  "Presence",
  "Trinity",
  "Athletics",
]

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    image: Array.isArray(product?.image) ? product.image[0] || "" : product?.image || "",
    category: product?.category || "",
    subCategory: product?.subCategory || "",
    sizes: Array.isArray(product?.sizes) ? product.sizes.join(", ") : "",
    bestseller: product?.bestseller || false,
    inStock: product?.inStock !== undefined ? product.inStock : true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Parse sizes
      const sizesArray = formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      // Prepare image - convert to array format
      const imageData = formData.image ? [formData.image] : []

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageData,
        category: formData.category,
        subCategory: formData.subCategory,
        sizes: sizesArray,
        bestseller: formData.bestseller,
        inStock: formData.inStock,
      }

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to save product")
        return
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Add Product"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
            <input
              type="text"
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              required
              placeholder="e.g., T-Shirts, Jackets, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              placeholder="XS, S, M, L, XL, XXL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">Bestseller</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

