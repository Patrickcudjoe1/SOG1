import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH - Update an address
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    // Verify address belongs to user
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName: fullName || existingAddress.fullName,
        phone: phone !== undefined ? phone : existingAddress.phone,
        addressLine1: addressLine1 || existingAddress.addressLine1,
        addressLine2: addressLine2 !== undefined ? addressLine2 : existingAddress.addressLine2,
        city: city || existingAddress.city,
        region: state !== undefined ? state : existingAddress.region,
        postalCode: postalCode || existingAddress.postalCode,
        country: country || existingAddress.country,
        isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault,
      },
    });

    return NextResponse.json({ message: "Address updated successfully", address });
  } catch (error: any) {
    console.error("Update address error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// DELETE - Delete an address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify address belongs to user
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error: any) {
    console.error("Delete address error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}

