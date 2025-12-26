import { NextRequest, NextResponse } from 'next/server'

// Firebase handles signup client-side only
// This endpoint is kept for backward compatibility but returns error
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Please use Firebase Authentication on the client side',
      message: 'Sign up through the Firebase Auth UI component',
      hint: 'Use signUpWithEmail from app/lib/firebase/auth.ts'
    },
    { status: 400 }
  )
}