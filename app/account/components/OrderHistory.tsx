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
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchOrders()
    
    // Refresh orders every 10 seconds to catch payment updates
    const interval = setInterval(() => {
      fetchOrders(true) // Silent refresh
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true)
      }
      
      // Force fresh data with cache busting
      const timestamp = Date.now()
      const res = await fetch(`/api/account/orders?_t=${timestamp}`, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      })
      if (res.ok) {
        const data = await res.json()
        // Handle API response structure
        if (data.success && data.data) {
          setOrders(data.data || [])
          setLastUpdated(new Date())
        } else if (data.orders) {
          // Fallback for old response format
          setOrders(data.orders || [])
          setLastUpdated(new Date())
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    fetchOrders(false) // Non-silent refresh with loading state
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED':
        return '🟢'
      case 'PROCESSING':
      case 'SHIPPED':
        return '🟡'
      case 'PENDING':
        return '🟠'
      case 'FAILED':
      case 'CANCELLED':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getShortOrderNumber = (fullId: string, orderNumber?: string) => {
    if (orderNumber) {
      return orderNumber
    }
    return `#${fullId.slice(-6).toUpperCase()}`
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodMap: Record<string, string> = {
      'paystack': 'Paystack',
      'stripe': 'Stripe',
      'mobile_money': 'Mobile Money',
      'card': 'Card',
    }
    return methodMap[method.toLowerCase()] || method
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-sm font-light tracking-widest uppercase mb-4">Order History</h2>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border bg-card p-5 rounded-sm animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24 mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-light tracking-widest uppercase mb-4">Order History</h2>
        <div className="border border-border bg-card p-8 rounded-sm text-center">
          <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-light text-muted-foreground mb-2">No orders yet</p>
          <p className="text-xs text-muted-foreground mb-4">Start shopping to see your orders here</p>
          <Link 
            href="/shop" 
            className="inline-block px-6 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors text-xs tracking-widest uppercase font-light"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-light tracking-widest uppercase">Order History</h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="text-xs px-3 py-1.5 border border-border hover:bg-muted transition-colors rounded-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-border bg-card p-5 rounded-sm shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium tracking-wide">
                    {getShortOrderNumber(order.id, order.orderNumber)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar size={12} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusBadge(order.status)}`}>
                    <span>{getStatusIcon(order.status)}</span>
                    {formatStatus(order.status)}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.paymentStatus)}`}>
                    <span>{getStatusIcon(order.paymentStatus)}</span>
                    {formatStatus(order.paymentStatus)}
                  </span>
                  {order.paymentMethod && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {getPaymentMethodBadge(order.paymentMethod)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4 mb-4">
              {order.items && order.items.length > 0 && order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.productImage && (
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-sm overflow-hidden">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items && order.items.length > 2 && (
                <p className="text-xs text-muted-foreground pl-15">
                  +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Link 
                href={`/orders/${order.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm"
              >
                View Order
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

