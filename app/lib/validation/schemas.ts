import { z } from "zod"

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email format")

/**
 * Phone validation schema (Ghana)
 */
export const ghanaPhoneSchema = z
  .string()
  .regex(/^0\d{9}$/, "Invalid Ghana phone number format (must be 10 digits starting with 0)")

/**
 * Shipping address schema
 */
export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: emailSchema,
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  region: z.string().optional().nullable(),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("Ghana"),
})

/**
 * Cart item schema
 */
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  image: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be positive"),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
})

/**
 * Checkout schema
 */
export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
  shipping: shippingAddressSchema,
  deliveryMethod: z.enum(["standard", "express", "pickup"]).optional(),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
  promoCode: z.string().optional().nullable(),
})

/**
 * Mobile money checkout schema
 */
export const mobileMoneyCheckoutSchema = checkoutSchema.extend({
  mobileMoneyPhone: ghanaPhoneSchema,
  mobileMoneyProvider: z.enum(["mtn", "vodafone", "airteltigo"]),
})

/**
 * User registration schema
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
})

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: emailSchema.optional(),
})

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

/**
 * Address schema
 */
export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: emailSchema,
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  region: z.string().optional().nullable(),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("Ghana"),
  isDefault: z.boolean().default(false),
})

/**
 * Promo code schema
 */
export const promoCodeSchema = z.object({
  code: z.string().min(1, "Promo code is required"),
})

/**
 * Product filters schema
 */
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  search: z.string().optional(),
  inStock: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

