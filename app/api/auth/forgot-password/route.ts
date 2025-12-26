import { NextRequest, NextResponse } from "next/server"

/**
 * Forgot password via Firebase Auth
 * 
 * NOTE: Firebase Authentication handles password reset natively.
 * Users should use the client-side Firebase Auth password reset flow.
 * 
 * To implement on the client:
 * 1. Import Firebase Auth: import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
 * 2. Call: await sendPasswordResetEmail(auth, email)
 * 3. User receives email with secure reset link from Firebase
 * 
 * This API endpoint is kept for backward compatibility but redirects
 * to the proper Firebase Auth flow.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Firebase Auth handles password reset natively on the client side
    // This endpoint should guide users to use the client-side flow
    return NextResponse.json({
      message:
        "Password reset is handled by Firebase Auth. Please use the 'Forgot Password' link on the sign-in page to receive a reset email.",
      note: "For security, we cannot confirm if this email exists in our system.",
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}