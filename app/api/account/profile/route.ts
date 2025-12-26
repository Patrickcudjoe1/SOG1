import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/api/middleware";
import { firestoreDB, COLLECTIONS, User } from "@/app/lib/firebase/db";

export async function GET(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await firestoreDB.get<User>(COLLECTIONS.USERS, user.id);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userData });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error, user } = await requireAuth(req);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await firestoreDB.update<User>(COLLECTIONS.USERS, user.id, { 
      name: name.trim() 
    });
    
    const updatedUser = await firestoreDB.get<User>(COLLECTIONS.USERS, user.id);

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}