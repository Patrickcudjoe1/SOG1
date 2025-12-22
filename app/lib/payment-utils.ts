import crypto from "crypto"

/**
 * Generate a unique idempotency key to prevent duplicate payments
 */
export function generateIdempotencyKey(): string {
  return `idemp_${Date.now()}_${crypto.randomBytes(16).toString("hex")}`
}

/**
 * Validate Ghana phone number format
 */
export function validateGhanaPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s/g, "")
  // Ghana phone: 0XXXXXXXXX (10 digits starting with 0)
  const phoneRegex = /^0\d{9}$/
  return phoneRegex.test(cleanPhone)
}

/**
 * Format phone number for mobile money
 */
export function formatGhanaPhone(phone: string): string {
  return phone.replace(/\s/g, "")
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize amount to prevent manipulation
 */
export function sanitizeAmount(amount: number): number {
  return Math.round(amount * 100) / 100 // Round to 2 decimal places
}

