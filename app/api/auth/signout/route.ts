import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ success: true })
    
    // Delete the Firebase ID token cookie
    response.cookies.delete('firebase-id-token')
    
    // Also delete legacy auth tokens if they exist
    response.cookies.delete('firebase-token')
    response.cookies.delete('auth-token')
    
    return response
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}