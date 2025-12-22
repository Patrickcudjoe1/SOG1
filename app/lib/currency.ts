/**
 * Currency utility functions for Ghana Cedis (GHS)
 */

export const CURRENCY_SYMBOL = "₵"
export const CURRENCY_CODE = "GHS"

/**
 * Format a number as Ghana Cedis
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "₵100.00")
 */
export function formatCurrency(amount: number | string, decimals: number = 2): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return `${CURRENCY_SYMBOL}0.00`
  return `${CURRENCY_SYMBOL}${numAmount.toFixed(decimals)}`
}

/**
 * Format a number as Ghana Cedis without decimals (for whole numbers)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₵100")
 */
export function formatCurrencyWhole(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return `${CURRENCY_SYMBOL}0`
  return `${CURRENCY_SYMBOL}${Math.round(numAmount)}`
}

