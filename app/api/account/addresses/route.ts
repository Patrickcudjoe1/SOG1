import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all addresses for the current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST - Create a new address
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    // Validation
    if (!fullName || !addressLine1 || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: "Full name, address line 1, city, postal code, and country are required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone: phone || null,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        region: state || null,
        postalCode,
        country: country || "Ghana",
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ message: "Address created successfully", address }, { status: 201 });
  } catch (error: any) {
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

