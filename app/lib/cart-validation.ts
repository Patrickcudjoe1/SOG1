import { products, getProductBySlug } from "@/app/lib/products"
import type { CartItem } from "@/app/components/CartContext"

export interface ValidationError {
  itemId: string
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  validatedItems: CartItem[]
  correctedSubtotal: number
}

/**
 * Server-side cart validation function
 * Can be used in API routes without HTTP calls
 */
export async function validateCartItems(items: CartItem[]): Promise<ValidationResult> {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      errors: [{ itemId: "cart", field: "items", message: "Cart is empty" }],
      validatedItems: [],
      correctedSubtotal: 0,
    }
  }

  const errors: ValidationError[] = []
  const validatedItems: CartItem[] = []
  let correctedSubtotal = 0

  for (const item of items) {
    const itemErrors: ValidationError[] = []

    // Validate required fields - accept either id or productId
    const itemIdentifier = item.productId || item.id
    if (!itemIdentifier) {
      itemErrors.push({
        itemId: item.id || "unknown",
        field: "id",
        message: "Product ID is required",
      })
      continue
    }

    // Find product by ID or slug - check both id and productId
    let product = products.find((p) => p.id === itemIdentifier || p.id === item.id)

    // If not found by ID, try to find by slug
    if (!product) {
      product = getProductBySlug(itemIdentifier)
    }

    if (!product) {
      itemErrors.push({
        itemId: item.id,
        field: "productId",
        message: `Product not found: ${item.productId || item.id}`,
      })
      errors.push(...itemErrors)
      continue
    }

    // Validate price
    if (typeof item.price !== "number" || item.price <= 0) {
      itemErrors.push({
        itemId: item.id,
        field: "price",
        message: "Invalid price",
      })
    } else if (Math.abs(item.price - product.price) > 0.01) {
      // Price mismatch - use server price
      itemErrors.push({
        itemId: item.id,
        field: "price",
        message: `Price mismatch. Corrected from ${item.price} to ${product.price}`,
      })
    }

    // Validate quantity
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      itemErrors.push({
        itemId: item.id,
        field: "quantity",
        message: "Quantity must be greater than 0",
      })
    } else if (item.quantity > 99) {
      // Limit quantity to 99
      itemErrors.push({
        itemId: item.id,
        field: "quantity",
        message: "Quantity exceeds maximum (99). Limited to 99",
      })
    }

    // Validate size if provided
    if (item.size && product.sizes && product.sizes.length > 0) {
      if (!product.sizes.includes(item.size)) {
        itemErrors.push({
          itemId: item.id,
          field: "size",
          message: `Size "${item.size}" is not available. Available sizes: ${product.sizes.join(", ")}`,
        })
      }
    }

    // Validate color if provided
    if (item.color && product.colors && product.colors.length > 0) {
      if (!product.colors.includes(item.color)) {
        itemErrors.push({
          itemId: item.id,
          field: "color",
          message: `Color "${item.color}" is not available. Available colors: ${product.colors.join(", ")}`,
        })
      }
    }

    // If there are critical errors, skip this item
    const criticalErrors = itemErrors.filter(
      (e) => e.field === "productId" || e.field === "quantity"
    )
    if (criticalErrors.length > 0) {
      errors.push(...itemErrors)
      continue
    }

    // Create validated item with corrected values - ensure both id and productId are set
    const validatedItem: CartItem = {
      id: item.id || product.id,
      productId: product.id,
      name: product.name,
      price: product.price, // Use server price
      image: product.image || item.image,
      size: item.size || undefined,
      color: item.color || undefined,
      quantity: Math.min(item.quantity, 99), // Limit to 99
    }

    validatedItems.push(validatedItem)
    correctedSubtotal += validatedItem.price * validatedItem.quantity
  }

  const valid = errors.length === 0 && validatedItems.length > 0

  return {
    valid,
    errors,
    validatedItems,
    correctedSubtotal,
  }
}

