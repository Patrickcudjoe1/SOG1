import { PrismaClient } from "@prisma/client"
import { products, getProductById, getProductBySlug } from "@/app/lib/products"

const prisma = new PrismaClient()

export interface ProductFilters {
  category?: string
  collection?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  inStock?: boolean
}

export class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getProducts(filters?: ProductFilters) {
    let filteredProducts = [...products]

    // Apply filters
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }

    if (filters?.collection) {
      filteredProducts = filteredProducts.filter(
        (p) => p.collection?.toLowerCase() === filters.collection!.toLowerCase()
      )
    }

    if (filters?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice!)
    }

    if (filters?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
    }

    if (filters?.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.inStock === filters.inStock)
    }

    return filteredProducts
  }

  /**
   * Get product by ID
   */
  static async getProductById(productId: string) {
    return getProductById(productId)
  }

  /**
   * Get product by slug
   */
  static async getProductBySlug(slug: string) {
    return getProductBySlug(slug)
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string) {
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  /**
   * Get products by collection
   */
  static async getProductsByCollection(collection: string) {
    return products.filter(
      (p) => p.collection?.toLowerCase() === collection.toLowerCase()
    )
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, limit = 20) {
    const queryLower = query.toLowerCase()
    const results = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.description?.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower) ||
          p.collection?.toLowerCase().includes(queryLower)
      )
      .slice(0, limit)

    return results
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit = 8) {
    return products.filter((p) => p.featured).slice(0, limit)
  }

  /**
   * Get new arrivals
   */
  static async getNewArrivals(limit = 8) {
    return products
      .filter((p) => p.newArrival)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, limit)
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId: string, limit = 4) {
    const product = getProductById(productId)
    if (!product) return []

    return products
      .filter(
        (p) =>
          p.id !== productId &&
          (p.category === product.category || p.collection === product.collection)
      )
      .slice(0, limit)
  }

  /**
   * Get product statistics
   */
  static async getProductStats() {
    const categories = new Set(products.map((p) => p.category))
    const collections = new Set(
      products.map((p) => p.collection).filter((c) => c)
    )

    const totalProducts = products.length
    const inStockProducts = products.filter((p) => p.inStock).length
    const outOfStockProducts = totalProducts - inStockProducts

    const averagePrice =
      products.reduce((sum, p) => sum + p.price, 0) / totalProducts

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categories: categories.size,
      collections: collections.size,
      averagePrice: Math.round(averagePrice * 100) / 100,
    }
  }

  /**
   * Validate product availability
   */
  static async validateProductAvailability(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) {
    const product = getProductById(productId)

    if (!product) {
      return { available: false, error: "Product not found" }
    }

    if (!product.inStock) {
      return { available: false, error: "Product out of stock" }
    }

    if (quantity > (product.stock || 0)) {
      return {
        available: false,
        error: `Only ${product.stock} items available`,
      }
    }

    // Validate size if required
    if (size && product.sizes && !product.sizes.includes(size)) {
      return { available: false, error: "Invalid size" }
    }

    // Validate color if required
    if (color && product.colors && !product.colors.includes(color)) {
      return { available: false, error: "Invalid color" }
    }

    return { available: true }
  }
}

