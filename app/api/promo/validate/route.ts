import { NextRequest, NextResponse } from "next/server";
import { firestoreDB, COLLECTIONS, PromoCode } from "@/app/lib/firebase/db";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Promo code is required" }, { status: 400 });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ valid: false, error: "Invalid amount" }, { status: 400 });
    }

    const promos = await firestoreDB.getMany<PromoCode>(
      COLLECTIONS.PROMO_CODES,
      { orderBy: "code", equalTo: code.toUpperCase().trim(), limitToFirst: 1 }
    );
    
    const promo = promos[0] || null;

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" }, { status: 200 });
    }

    // Check if promo is active
    if (!promo.isActive) {
      return NextResponse.json({ valid: false, error: "This promo code is no longer active" }, { status: 200 });
    }

    // Check validity dates
    const now = new Date();
    if (promo.validFrom && now < promo.validFrom) {
      return NextResponse.json({ valid: false, error: "This promo code is not yet valid" }, { status: 200 });
    }

    if (promo.validUntil && now > promo.validUntil) {
      return NextResponse.json({ valid: false, error: "This promo code has expired" }, { status: 200 });
    }

    // Check minimum purchase
    if (promo.minPurchase && amount < promo.minPurchase) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum purchase of ${promo.minPurchase} required for this promo code`,
        },
        { status: 200 }
      );
    }

    // Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return NextResponse.json({ valid: false, error: "This promo code has reached its usage limit" }, { status: 200 });
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === "PERCENTAGE") {
      discount = (amount * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.discountValue;
      if (discount > amount) {
        discount = amount; // Don't discount more than the total
      }
    }

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
      promoCode: promo.code,
      description: promo.description,
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ valid: false, error: "Failed to validate promo code" }, { status: 500 });
  }
}

