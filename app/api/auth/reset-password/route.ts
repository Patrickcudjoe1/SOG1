import { NextRequest, NextResponse } from "next/server"

/**
 * Password reset via Firebase Auth
 * 
 * NOTE: Firebase Authentication handles password reset natively.
 * This route is kept for backward compatibility but should redirect
 * users to use Firebase's built-in password reset flow.
 * 
 * To implement:
 * 1. Use Firebase Auth's sendPasswordResetEmail() on the client
 * 2. User receives email with reset link
 * 3. Firebase handles the reset securely
 * 
 * Example client-side code:
 * import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
 * 
 * const auth = getAuth()
 * await sendPasswordResetEmail(auth, email)
 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Firebase Auth handles password reset natively
    // This endpoint should not be used for Firebase-based authentication
    return NextResponse.json(
      {
        error:
          "Password reset is handled by Firebase Auth. Please use the password reset email link sent to your email.",
        message:
          "For password reset, please request a new reset link from the sign-in page.",
      },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
