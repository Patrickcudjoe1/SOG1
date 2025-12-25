import { NextRequest, NextResponse } from 'next/server'
import { deleteTokenCookie } from '@/app/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    await deleteTokenCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}

