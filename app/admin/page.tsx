"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatCurrency } from "@/app/lib/currency"

interface DashboardStats {
  overview: {
    totalUsers: number
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    processingOrders: number
    completedOrders: number
    todayOrders: number
    todayRevenue: number
  }
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard")
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
    return <div>Failed to load dashboard</div>
  }

  const { overview, recentOrders, topProducts } = stats

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your e-commerce platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overview.totalRevenue)}
          icon="💰"
          trend="+12%"
        />
        <StatCard
          title="Total Orders"
          value={overview.totalOrders.toLocaleString()}
          icon="📦"
          trend="+8%"
        />
        <StatCard
          title="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon="👥"
          trend="+15%"
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(overview.todayRevenue)}
          icon="📈"
          trend={`+${overview.todayOrders} orders`}
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{overview.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Processing</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{overview.processingOrders}</p>
            </div>
            <div className="text-4xl">🔄</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{overview.completedOrders}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {order.user?.name || order.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PROCESSING"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-400 mr-4">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">
                      {product.orderCount} orders • {product.totalQuantity} sold
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string
  value: string
  icon: string
  trend: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-green-600 mt-2">{trend}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}

