"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/lib/currency"

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load analytics</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600">Detailed insights and reports</p>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats.overview.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.overview.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.overview.totalUsers}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
        <div className="space-y-4">
          {stats.topProducts.map((product: any, index: number) => (
            <div
              key={product.productId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-400 mr-4 w-8">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-gray-600">
                    {product.orderCount} orders • {product.totalQuantity} units sold
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

