"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { CheckCircle, Package, Mail, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency } from "@/app/lib/currency";

interface OrderDetails {
  orderNumber: string;
  totalAmount: number;
  email: string;
  status: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    // If we have a Stripe session ID, verify payment first
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchOrderDetails();
          } else {
            setError("Payment verification failed");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          // Still try to fetch order details
          fetchOrderDetails();
        });
    } else {
      fetchOrderDetails();
    }
  }, [orderId, sessionId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const result = await response.json();
      
      // Handle API response structure
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Navbar />
        <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-6">
          <div className="text-center">
            <p className="text-sm font-light text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Navbar />
        <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-6">
          <div className="text-center max-w-md">
            <XCircle size={64} className="mx-auto mb-8 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 dark:text-white">Order Error</h1>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-8">
              {error || "Unable to load order details. Please contact support if you have completed payment."}
            </p>
            <Link href="/account" className="inline-block btn-outline dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
              View Orders
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      <section className="w-full py-12 md:py-20 px-4 md:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <CheckCircle size={64} className="mx-auto mb-6 text-green-600" />
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 dark:text-white">Order Confirmed</h1>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase! Your order has been received and is being processed.
            </p>
            <p className="text-xs font-light text-gray-500 dark:text-gray-500">Order Number: {order.orderNumber}</p>
          </motion.div>

          <div className="border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Package size={20} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-light tracking-wide dark:text-white">Order Details</h2>
            </div>

            <div className="space-y-4 mb-6">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-light">{item.productName}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-light">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No items found</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-light text-gray-600">Total</span>
                <span className="text-lg font-light">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={20} className="text-gray-600" />
              <h2 className="text-lg font-light tracking-wide">What's Next?</h2>
            </div>
            <div className="space-y-3 text-sm font-light text-gray-700">
              <p>• A confirmation email has been sent to <strong>{order.email}</strong></p>
              <p>• You will receive shipping updates via email</p>
              <p>• Order status: <strong className="uppercase">{order.status}</strong></p>
              <p>• For any questions, please contact our customer service</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-outline text-center">
              Continue Shopping
            </Link>
            <Link href="/account" className="btn-outline text-center">
              View My Orders
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

