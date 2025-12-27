import { NextRequest, NextResponse } from "next/server"
import { COLLECTIONS, Product } from "@/app/lib/firebase/db"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { getAdminDatabase } from "@/app/lib/firebase/admin"

/**
 * GET /api/admin/products
 * Get all products (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req)
    if (error) {
      return errorResponse(error, 401)
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""

    // Get all products using Admin SDK
    const db = getAdminDatabase()
    const productsRef = db.ref(COLLECTIONS.PRODUCTS)
    const snapshot = await productsRef.get()
    
    let products: Product[] = []
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        products.push(childSnapshot.val() as Product)
      })
    }

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
    if (error) {
      return errorResponse(error, 401)
    }

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

    // Create product using Admin SDK
    const db = getAdminDatabase()
    const productRef = db.ref(`${COLLECTIONS.PRODUCTS}/${productId}`)
    
    const timestamp = new Date().toISOString()
    const productData = {
      id: productId,
      name,
      description,
      price: parseFloat(price),
      image: image || [],
      category,
      subCategory,
      sizes: sizes || {},
      bestseller: bestseller || false,
      inStock: inStock !== undefined ? inStock : true,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    
    await productRef.set(productData)
    const product = productData as Product

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
