import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import crypto from "crypto"

/**
 * POST /api/admin/test-webhook
 * Test Paystack webhook with a sample payload
 */
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    const { orderNumber } = await req.json()

    if (!orderNumber) {
      return errorResponse("Order number is required", 400)
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return errorResponse("Paystack secret key not configured", 500)
    }

    // Create a test webhook payload
    const testPayload = {
      event: "charge.success",
      data: {
        reference: orderNumber,
        status: "success",
        gateway_response: "Successful",
        amount: 10000, // 100.00 GHS in pesewas
        customer: {
          email: "test@example.com",
        },
      },
    }

    const body = JSON.stringify(testPayload)

    // Generate signature
    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(body)
      .digest("hex")

    // Call the webhook endpoint
    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/webhooks/paystack`
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": hash,
      },
      body,
    })

    const result = await response.json()

    return successResponse(
      {
        webhookResponse: result,
        status: response.status,
        testPayload,
      },
      "Test webhook sent successfully"
    )
  } catch (error: any) {
    console.error("Test webhook error:", error)
    return errorResponse(error.message || "Failed to test webhook", 500)
  }
}