import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/api/middleware";
import { adminDB, COLLECTIONS, Address } from "@/app/lib/firebase/admin-db";

// GET - Fetch all addresses for the current user
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all addresses and filter by userId (Realtime DB doesn't support complex queries)
    const allAddresses = await adminDB.getMany<Address>(COLLECTIONS.ADDRESSES);
    let addresses = allAddresses.filter(addr => addr.userId === user.id);
    
    // Sort by default first, then by creation date
    addresses.sort((a, b) => {
      if (a.isDefault !== b.isDefault) {
        return b.isDefault ? 1 : -1;
      }
      const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime();
      const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime();
      return bTime - aTime;
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
    const { error, user } = await requireAuth(req);

    if (error || !user) {
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
      const allAddresses = await adminDB.getMany<Address>(COLLECTIONS.ADDRESSES);
      const defaultAddresses = allAddresses.filter(
        addr => addr.userId === user.id && addr.isDefault === true
      );
      
      for (const addr of defaultAddresses) {
        await adminDB.update<Address>(COLLECTIONS.ADDRESSES, addr.id, { isDefault: false });
      }
    }

    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const address = await adminDB.create<Address>(COLLECTIONS.ADDRESSES, addressId, {
      userId: user.id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      region: state,
      postalCode,
      country: country || "Ghana",
      isDefault: isDefault || false,
    });

    return NextResponse.json({ message: "Address created successfully", address }, { status: 201 });
  } catch (error: any) {
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

