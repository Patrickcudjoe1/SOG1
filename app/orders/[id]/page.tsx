"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Package, Calendar, MapPin, CreditCard, Truck, ArrowLeft } from "lucide-react"
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
  size?: string
  color?: string
}

interface Address {
  fullName: string
  email: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city: string
  region?: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  subtotal: number
  shippingCost: number
  discountAmount: number
  paymentMethod: string
  deliveryMethod?: string
  email: string
  phone?: string
  createdAt: string
  items: OrderItem[]
  shippingAddress?: Address
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided")
      setLoading(false)
      return
    }

    fetchOrderDetails()
    
    // Poll for payment status updates for pending orders
    const interval = setInterval(() => {
      if (order && order.paymentStatus === 'PENDING') {
        fetchOrderDetails()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [orderId, order?.paymentStatus])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        cache: 'no-store',
        credentials: 'same-origin'
      })
      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }
      const result = await response.json()
      
      if (result.success && result.data) {
        setOrder(result.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching order:", err)
      setError("Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'text-green-800 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800'
      case 'PENDING':
        return 'text-amber-800 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800'
      case 'FAILED':
        return 'text-red-800 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800'
      case 'REFUNDED':
        return 'text-blue-800 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800'
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-800'
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-800 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800'
      case 'SHIPPED':
        return 'text-blue-800 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800'
      case 'PROCESSING':
        return 'text-amber-800 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800'
      case 'PENDING':
        return 'text-orange-800 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-800'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-800 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800'
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-800'
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

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <Package size={64} className="mx-auto mb-8 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">Order Not Found</h1>
            <p className="text-sm font-light text-gray-600 mb-8">
              {error || "Unable to load order details."}
            </p>
            <Link href="/account" className="inline-block px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase">
              Back to Account
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      <section className="w-full py-16 md:py-20 px-6 md:px-12 pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 mb-8 text-sm tracking-widest uppercase hover:opacity-60 transition-opacity"
          >
            <ArrowLeft size={16} />
            Back to Account
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">
              Order Details
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-gray-600" />
                <span className="text-sm tracking-widest uppercase font-light">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-600" />
                <span className="text-xs text-gray-600">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-sm border-2 ${getOrderStatusBadge(order.status)}`}>
              <div className="text-xs tracking-widest uppercase font-semibold mb-2 opacity-75">Order Status</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{getStatusIcon(order.status)}</span>
                <span className="text-lg font-semibold tracking-wide">{formatStatus(order.status)}</span>
              </div>
            </div>
            <div className={`p-4 rounded-sm border-2 ${getPaymentStatusBadge(order.paymentStatus)}`}>
              <div className="text-xs tracking-widest uppercase font-semibold mb-2 opacity-75">Payment Status</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{getStatusIcon(order.paymentStatus)}</span>
                <span className="text-lg font-semibold tracking-wide">{formatStatus(order.paymentStatus)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-border p-6 mb-6 bg-card rounded-sm">
            <h2 className="text-lg font-light tracking-wide mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 && order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.productImage && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-light mb-1">{item.productName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-light pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="border border-border p-6 bg-card rounded-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-gray-600" />
                  <h2 className="text-lg font-light tracking-wide">Shipping Address</h2>
                </div>
                <div className="text-sm space-y-1 text-gray-700">
                  <p className="font-light">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                  <p>Email: {order.shippingAddress.email}</p>
                </div>
              </div>
            )}

            {/* Payment & Delivery Info */}
            <div className="border border-border p-6 bg-card rounded-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-gray-600" />
                <h2 className="text-lg font-light tracking-wide">Payment & Delivery</h2>
              </div>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-1">Payment Method</p>
                  <p className="text-gray-700">{formatStatus(order.paymentMethod)}</p>
                </div>
                {order.deliveryMethod && (
                  <div>
                    <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-1">Delivery Method</p>
                    <p className="text-gray-700">{formatStatus(order.deliveryMethod)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-widest uppercase font-light text-gray-600 mb-1">Contact Email</p>
                  <p className="text-gray-700">{order.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="inline-block px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase text-center"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/contact" 
              className="inline-block px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}