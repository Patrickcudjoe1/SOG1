import { NextRequest, NextResponse } from "next/server"
import { adminDB, COLLECTIONS, Address } from "@/app/lib/firebase/admin-db"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth } from "@/app/lib/api/middleware"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth(req)
    if (error) return error

    if (!user?.id) {
      return errorResponse("User ID not found", 401)
    }

    const { id } = await params
    const existingAddress = await adminDB.get<Address>(COLLECTIONS.ADDRESSES, id)

    if (!existingAddress) {
      return errorResponse("Address not found", 404)
    }

    if (existingAddress.userId !== user.id) {
      return errorResponse("Unauthorized", 403)
    }

    const body = await req.json()
    const { isDefault } = body

    // If setting as default, unset all other defaults
    if (isDefault) {
      const addresses = await adminDB.getMany<Address>(
        COLLECTIONS.ADDRESSES,
        { orderBy: "userId", equalTo: user.id }
      )

      for (const addr of addresses) {
        if (addr.isDefault && addr.id !== id) {
          await adminDB.update<Address>(COLLECTIONS.ADDRESSES, addr.id, {
            isDefault: false,
          })
        }
      }
    }

    const address = await adminDB.update<Address>(COLLECTIONS.ADDRESSES, id, body)

    return successResponse({ address }, "Address updated successfully")
  } catch (error: any) {
    console.error("Update address error:", error)
    return errorResponse(error.message || "Failed to update address", 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth(req)
    if (error) return error

    if (!user?.id) {
      return errorResponse("User ID not found", 401)
    }

    const { id } = await params
    const existingAddress = await adminDB.get<Address>(COLLECTIONS.ADDRESSES, id)

    if (!existingAddress) {
      return errorResponse("Address not found", 404)
    }

    if (existingAddress.userId !== user.id) {
      return errorResponse("Unauthorized", 403)
    }

    await adminDB.delete(COLLECTIONS.ADDRESSES, id)

    return successResponse(null, "Address deleted successfully")
  } catch (error: any) {
    console.error("Delete address error:", error)
    return errorResponse(error.message || "Failed to delete address", 500)
  }
}