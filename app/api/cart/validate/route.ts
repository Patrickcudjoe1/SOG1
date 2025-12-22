import { NextRequest, NextResponse } from "next/server"
import { validateCartItems } from "@/app/lib/cart-validation"

/**
 * HTTP endpoint for server-side cart validation
 * Validates:
 * - Product existence
 * - Price accuracy
 * - Quantity limits
 * - Size/color availability
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items } = body

    const validationResult = await validateCartItems(items)

    return NextResponse.json({
      ...validationResult,
      message: validationResult.valid 
        ? "Cart validated successfully" 
        : `Validation completed with ${validationResult.errors.length} error(s)`
    })
  } catch (error: any) {
    console.error("Cart validation error:", error)
    return NextResponse.json(
      {
        valid: false,
        errors: [{ itemId: "system", field: "validation", message: error.message || "Validation failed" }],
        validatedItems: [],
        correctedSubtotal: 0
      },
      { status: 500 }
    )
  }
}

