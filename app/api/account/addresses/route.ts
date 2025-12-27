import { NextRequest, NextResponse } from "next/server"
import { adminDB, COLLECTIONS, Address } from "@/app/lib/firebase/admin-db"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth } from "@/app/lib/api/middleware"

export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req)
    if (error) return error

    if (!user?.id) {
      return errorResponse("User ID not found", 401)
    }

    // Get user addresses
    const addresses = await adminDB.getMany<Address>(
      COLLECTIONS.ADDRESSES,
      { orderBy: "userId", equalTo: user.id }
    )

    return successResponse({ addresses })
  } catch (error: any) {
    console.error("Fetch addresses error:", error)
    return errorResponse(error.message || "Failed to fetch addresses", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req)
    if (error) return error

    if (!user?.id) {
      return errorResponse("User ID not found", 401)
    }

    const body = await req.json()
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = body

    // Validation
    if (!fullName || !addressLine1 || !city || !postalCode) {
      return errorResponse("Missing required fields", 400)
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      const existingAddresses = await adminDB.getMany<Address>(
        COLLECTIONS.ADDRESSES,
        { orderBy: "userId", equalTo: user.id }
      )

      for (const addr of existingAddresses) {
        if (addr.isDefault) {
          await adminDB.update<Address>(COLLECTIONS.ADDRESSES, addr.id, {
            isDefault: false,
          })
        }
      }
    }

    // Create address
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const address = await adminDB.create<Address>(
      COLLECTIONS.ADDRESSES,
      addressId,
      {
        userId: user.id,
        fullName,
        phone: phone || undefined,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        region: state || undefined,
        postalCode,
        country: country || "Ghana",
        isDefault: isDefault || false,
      }
    )

    return successResponse({ address }, "Address created successfully")
  } catch (error: any) {
    console.error("Create address error:", error)
    return errorResponse(error.message || "Failed to create address", 500)
  }
}