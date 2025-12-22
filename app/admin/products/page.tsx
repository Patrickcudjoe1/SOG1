"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/lib/currency"
import Link from "next/link"
import ProductForm from "./components/ProductForm"
import { Trash2, Edit, Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  subCategory: string
  inStock: boolean
  image?: string | string[]
  description?: string
  sizes?: any
  bestseller?: boolean
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products?limit=100")
      const data = await res.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to delete product")
        return
      }

      // Remove from list
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error(error)
      alert("An error occurred while deleting the product")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    fetchProducts()
  }

  const getImageUrl = (image: string | string[] | undefined): string => {
    if (!image) return ""
    if (Array.isArray(image)) return image[0] || ""
    return image
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getImageUrl(product.image) && (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover mr-3"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        )}
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium">{formatCurrency(product.price)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          target="_blank"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

