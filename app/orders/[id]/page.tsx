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
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'FAILED':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      case 'REFUNDED':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'SHIPPED':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
      case 'PROCESSING':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'PENDING':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Navbar forceDark={true} />
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black dark:border-white border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Navbar forceDark={true} />
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <Package size={64} className="mx-auto mb-8 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 dark:text-white">Order Not Found</h1>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-8">
              {error || "Unable to load order details."}
            </p>
            <Link href="/account" className="inline-block px-6 py-3 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors text-xs tracking-widest uppercase dark:text-white">
              Back to Account
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar forceDark={true} />
      <section className="w-full py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 mb-8 text-sm tracking-widest uppercase hover:opacity-60 transition-opacity dark:text-white"
          >
            <ArrowLeft size={16} />
            Back to Account
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 dark:text-white">
              Order Details
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm tracking-widest uppercase font-light dark:text-gray-300">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded border ${getOrderStatusColor(order.status)}`}>
              <div className="text-xs tracking-widest uppercase font-light mb-1">Order Status</div>
              <div className="text-lg font-light tracking-wide">{formatStatus(order.status)}</div>
            </div>
            <div className={`p-4 rounded border ${getPaymentStatusColor(order.paymentStatus)}`}>
              <div className="text-xs tracking-widest uppercase font-light mb-1">Payment Status</div>
              <div className="text-lg font-light tracking-wide">{formatStatus(order.paymentStatus)}</div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-200 dark:border-gray-700 p-6 mb-6 bg-white dark:bg-gray-900 transition-colors">
            <h2 className="text-lg font-light tracking-wide mb-4 dark:text-white">Order Items</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 && order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  {item.productImage && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-light mb-1 dark:text-white">{item.productName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="dark:text-white">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="dark:text-white">{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-light pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-light tracking-wide dark:text-white">Shipping Address</h2>
                </div>
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
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
            <div className="border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-light tracking-wide dark:text-white">Payment & Delivery</h2>
              </div>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-xs tracking-widest uppercase font-light text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatStatus(order.paymentMethod)}</p>
                </div>
                {order.deliveryMethod && (
                  <div>
                    <p className="text-xs tracking-widest uppercase font-light text-gray-600 dark:text-gray-400 mb-1">Delivery Method</p>
                    <p className="text-gray-700 dark:text-gray-300">{formatStatus(order.deliveryMethod)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-widest uppercase font-light text-gray-600 dark:text-gray-400 mb-1">Contact Email</p>
                  <p className="text-gray-700 dark:text-gray-300">{order.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="inline-block px-6 py-3 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors text-xs tracking-widest uppercase text-center dark:text-white"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/contact" 
              className="inline-block px-6 py-3 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors text-xs tracking-widest uppercase text-center dark:text-white"
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