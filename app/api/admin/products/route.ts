import { NextRequest, NextResponse } from "next/server"
import { firestoreDB, COLLECTIONS, Product } from "@/app/lib/firebase/db"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse } from "@/app/lib/api/response"

/**
 * GET /api/admin/products
 * Get all products (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""

    // Get all products
    let products = await firestoreDB.getMany<Product>(COLLECTIONS.PRODUCTS)

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
    }

    // Sort by creation date descending
    products.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    const total = products.length
    const paginatedProducts = products.slice(offset, offset + limit)

    return successResponse(paginatedProducts, "Products retrieved successfully", {
      total,
      limit,
      hasMore: offset + limit < total,
    })
  } catch (error: any) {
    console.error("Get products error:", error)
    return errorResponse(error.message || "Failed to retrieve products", 500)
  }
}

/**
 * POST /api/admin/products
 * Create a new product (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const body = await req.json()
    const {
      name,
      description,
      price,
      image,
      category,
      subCategory,
      sizes,
      bestseller,
      inStock,
    } = body

    // Validation
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !subCategory
    ) {
      return errorResponse(
        "Missing required fields: name, description, price, category, subCategory",
        400
      )
    }

    if (price < 0) {
      return errorResponse("Price must be greater than or equal to 0", 400)
    }

    // Generate product ID
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create product
    const product = await firestoreDB.create<Product>(
      COLLECTIONS.PRODUCTS,
      productId,
      {
        name,
        description,
        price: parseFloat(price),
        image: image || [],
        category,
        subCategory,
        sizes: sizes || {},
        bestseller: bestseller || false,
        inStock: inStock !== undefined ? inStock : true,
      }
    )

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Create product error:", error)
    return errorResponse(error.message || "Failed to create product", 500)
  }
}