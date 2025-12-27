import { NextRequest, NextResponse } from "next/server"
import { adminDB, COLLECTIONS, Order, Address } from "@/app/lib/firebase/admin-db"
import { sendOrderEmails } from "@/app/lib/email/sendOrderEmails"

/**
 * Send order confirmation emails
 * This endpoint is called by the webhook after payment confirmation
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get order details
    const order = await adminDB.get<Order>(COLLECTIONS.ORDERS, id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if email already sent (duplicate prevention)
    if ((order as any).emailSent) {
      console.log(`📧 Email already sent for order ${order.orderNumber}, skipping`)
      return NextResponse.json({ 
        success: true, 
        message: "Email already sent",
        duplicate: true 
      })
    }

    // Get shipping address if exists
    let shippingAddress = order.shippingAddress
    if (!shippingAddress && order.shippingAddressId) {
      const address = await adminDB.get<Address>(
        COLLECTIONS.ADDRESSES,
        order.shippingAddressId
      )
      shippingAddress = address || undefined
    }

    // Send emails
    const result = await sendOrderEmails(order, shippingAddress)

    if (result.success) {
      // Mark email as sent
      await adminDB.update<Order>(COLLECTIONS.ORDERS, id, {
        emailSent: true,
      } as any)

      console.log(`✅ Email sent successfully for order ${order.orderNumber}`)
      return NextResponse.json({ success: true, message: "Emails sent successfully" })
    } else {
      console.error(`❌ Failed to send email for order ${order.orderNumber}:`, result.error)
      return NextResponse.json(
        { error: result.error || "Failed to send emails" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Send email error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send emails" },
      { status: 500 }
    )
  }
}