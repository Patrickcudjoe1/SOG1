import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db/prisma"
import { requireAdmin } from "@/app/lib/api/admin-middleware"
import { successResponse, errorResponse, notFoundResponse } from "@/app/lib/api/response"

/**
 * GET /api/admin/products/[id]
 * Get product by ID (admin only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return notFoundResponse("Product")
    }

    return successResponse(product, "Product retrieved successfully")
  } catch (error: any) {
    console.error("Get product error:", error)
    return errorResponse(error.message || "Failed to retrieve product", 500)
  }
}

/**
 * PATCH /api/admin/products/[id]
 * Update product (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { id } = await params
    const body = await req.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return notFoundResponse("Product")
    }

    // Prepare update data
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) {
      if (body.price < 0) {
        return errorResponse("Price must be greater than or equal to 0", 400)
      }
      updateData.price = parseFloat(body.price)
    }
    if (body.image !== undefined) updateData.image = body.image
    if (body.category !== undefined) updateData.category = body.category
    if (body.subCategory !== undefined) updateData.subCategory = body.subCategory
    if (body.sizes !== undefined) updateData.sizes = body.sizes
    if (body.bestseller !== undefined) updateData.bestseller = body.bestseller
    if (body.inStock !== undefined) updateData.inStock = body.inStock

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return successResponse(product, "Product updated successfully")
  } catch (error: any) {
    console.error("Update product error:", error)
    return errorResponse(error.message || "Failed to update product", 500)
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete product (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req)
    if (error) return error

    const { id } = await params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return notFoundResponse("Product")
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return successResponse({ id }, "Product deleted successfully")
  } catch (error: any) {
    console.error("Delete product error:", error)
    return errorResponse(error.message || "Failed to delete product", 500)
  }
}

