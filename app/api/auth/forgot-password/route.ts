import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth } from '@/app/lib/firebase/admin'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Generate password reset link using Firebase Admin
    const adminAuth = getAdminAuth()
    const resetLink = await adminAuth.generatePasswordResetLink(validatedData.email, {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
    })

    // Send email with reset link using SendGrid
    const sendgrid = await import('@sendgrid/mail')
    sendgrid.default.setApiKey(process.env.SENDGRID_API_KEY!)

    const msg = {
      to: validatedData.email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Reset Your Password - SOG',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background-color: #f9f9f9; }
              .button { display: inline-block; padding: 12px 30px; background-color: #000; color: #fff; text-decoration: none; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p><strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetLink}</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} SOG. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    await sendgrid.default.send(msg)

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    
    // Don't reveal if email exists or not for security
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  }
}