import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db/prisma"
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ])

    return successResponse(products, "Products retrieved successfully", {
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
    const { name, description, price, image, category, subCategory, sizes, bestseller, inStock } = body

    // Validation
    if (!name || !description || price === undefined || !category || !subCategory) {
      return errorResponse("Missing required fields: name, description, price, category, subCategory", 400)
    }

    if (price < 0) {
      return errorResponse("Price must be greater than or equal to 0", 400)
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || [],
        category,
        subCategory,
        sizes: sizes || {},
        bestseller: bestseller || false,
        inStock: inStock !== undefined ? inStock : true,
      },
    })

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

