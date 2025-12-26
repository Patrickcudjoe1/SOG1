import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/app/lib/api/middleware"
import { adminDB, COLLECTIONS, Address } from "@/app/lib/firebase/admin-db"

// PATCH - Update an address
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth(req)

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    // Verify address belongs to user
    const existingAddress = await adminDB.get<Address>(
      COLLECTIONS.ADDRESSES,
      id
    )

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    if (existingAddress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      const allAddresses = await adminDB.getMany<Address>(COLLECTIONS.ADDRESSES)
      const userAddresses = allAddresses.filter(
        addr => addr.userId === user.id && addr.isDefault === true && addr.id !== id
      )

      // Update all other default addresses to false
      for (const addr of userAddresses) {
        await adminDB.update<Address>(COLLECTIONS.ADDRESSES, addr.id, { isDefault: false })
      }
    }

    // Prepare update data
    const updateData: Partial<Address> = {}
    if (fullName !== undefined) updateData.fullName = fullName
    if (phone !== undefined) updateData.phone = phone
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.region = state
    if (postalCode !== undefined) updateData.postalCode = postalCode
    if (country !== undefined) updateData.country = country
    if (isDefault !== undefined) updateData.isDefault = isDefault

    await adminDB.update<Address>(COLLECTIONS.ADDRESSES, id, updateData)
    const address = await adminDB.get<Address>(COLLECTIONS.ADDRESSES, id)

    return NextResponse.json({
      message: "Address updated successfully",
      address,
    })
  } catch (error: any) {
    console.error("Update address error:", error)
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an address
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth(req)

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify address belongs to user
    const existingAddress = await adminDB.get<Address>(
      COLLECTIONS.ADDRESSES,
      id
    )

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    if (existingAddress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await adminDB.delete(COLLECTIONS.ADDRESSES, id)

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error: any) {
    console.error("Delete address error:", error)
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    )
  }
}