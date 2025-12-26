"use client"

import { useState, useEffect } from "react"
import { Package, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/app/lib/currency"

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string | null
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

interface OrderHistoryProps {
  userId: string
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/account/orders", {
        cache: 'no-store', // User-specific data, don't cache
        credentials: 'same-origin', // Include cookies
      })
      if (res.ok) {
        const data = await res.json()
        // Handle API response structure
        if (data.success && data.data) {
          setOrders(data.data || [])
        } else if (data.orders) {
          // Fallback for old response format
          setOrders(data.orders || [])
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'text-green-600 dark:text-green-400'
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'FAILED':
        return 'text-red-600 dark:text-red-400'
      case 'REFUNDED':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600 dark:text-green-400'
      case 'SHIPPED':
        return 'text-blue-600 dark:text-blue-400'
      case 'PROCESSING':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'PENDING':
        return 'text-orange-600 dark:text-orange-400'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (loading) {
    return <div className="text-sm font-light text-gray-600">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-light tracking-widest uppercase mb-4">Order History</h2>
        <div className="text-sm font-light text-gray-600">No orders yet</div>
        <Link href="/shop" className="inline-block mt-4 text-xs tracking-widest uppercase font-light hover:opacity-60">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-sm font-light tracking-widest uppercase mb-4 dark:text-white">Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-xs tracking-widest uppercase font-light text-gray-600 dark:text-gray-400">
                    {order.orderNumber || `Order #${order.id.slice(0, 8)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar size={12} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs tracking-widest uppercase font-light ${getOrderStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className={`text-xs tracking-widest uppercase font-light ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-light mb-1 dark:text-white">{formatCurrency(order.totalAmount)}</div>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              {order.items && order.items.length > 0 && order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.productImage && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-light dark:text-white">{item.productName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Link 
                href={`/orders/${order.id}`}
                className="inline-block text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity dark:text-white"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

