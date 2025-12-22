# Backend Architecture Documentation

## Overview

This document describes the backend architecture of the SOG e-commerce application. The backend is built using Next.js API Routes with a service-oriented architecture.

## Architecture Layers

### 1. API Routes (`/app/api/`)

API routes handle HTTP requests and responses. They should be thin and delegate business logic to services.

**Structure:**
```
/app/api/
  ├── auth/          # Authentication endpoints
  ├── account/       # User account management
  ├── cart/          # Cart operations
  ├── checkout/      # Checkout and payment
  ├── orders/        # Order management
  ├── products/      # Product endpoints
  ├── webhooks/      # Payment webhooks
  └── health/        # Health check
```

### 2. Service Layer (`/app/lib/services/`)

Services contain business logic and interact with the database.

**Services:**
- `OrderService` - Order creation, retrieval, updates
- `ProductService` - Product queries, filtering, search
- `UserService` - User management, authentication helpers

**Example:**
```typescript
import { OrderService } from "@/app/lib/services/order-service"

const order = await OrderService.createOrder(orderData)
```

### 3. Validation Layer (`/app/lib/validation/`)

Validation schemas and helpers using Zod.

**Files:**
- `schemas.ts` - Zod schemas for request validation
- `validate.ts` - Validation helper functions

**Example:**
```typescript
import { validateRequest } from "@/app/lib/validation/validate"
import { checkoutSchema } from "@/app/lib/validation/schemas"

const validation = await validateRequest(checkoutSchema, body)
if (!validation.success) return validation.response
```

### 4. API Utilities (`/app/lib/api/`)

Common utilities for API routes.

**Files:**
- `response.ts` - Standardized response helpers
- `middleware.ts` - Authentication, rate limiting, CORS

**Example:**
```typescript
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth } from "@/app/lib/api/middleware"

const { error, user } = await requireAuth(req)
if (error) return error
```

### 5. Database Layer (`/app/lib/db/`)

Database connection and utilities.

**Files:**
- `prisma.ts` - Prisma client singleton, health checks

## API Endpoints

### Products

#### `GET /api/products`
Get all products with optional filters.

**Query Parameters:**
- `category` - Filter by category
- `collection` - Filter by collection
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search query
- `inStock` - Filter by stock status
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

#### `GET /api/products/[id]`
Get product by ID.

#### `GET /api/products/stats`
Get product statistics (requires auth).

### Orders

#### `GET /api/orders/stats`
Get order statistics (requires auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 10,
    "processing": 5,
    "completed": 130,
    "cancelled": 5,
    "revenue": 50000.00
  }
}
```

### Health

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "database": "connected"
  }
}
```

## Service Layer

### OrderService

**Methods:**
- `createOrder(data)` - Create new order
- `getOrderById(id, userId?)` - Get order by ID
- `getOrderByOrderNumber(number, userId?)` - Get order by order number
- `getUserOrders(userId, limit, offset)` - Get user's orders
- `updateOrderStatus(id, status, paymentStatus?)` - Update order status
- `updatePaymentStatus(id, status, stripePaymentIntentId?)` - Update payment status
- `checkDuplicateOrder(idempotencyKey)` - Check for duplicate orders
- `getOrderStats(userId?)` - Get order statistics

### ProductService

**Methods:**
- `getProducts(filters?)` - Get products with filters
- `getProductById(id)` - Get product by ID
- `getProductBySlug(slug)` - Get product by slug
- `getProductsByCategory(category)` - Get products by category
- `getProductsByCollection(collection)` - Get products by collection
- `searchProducts(query, limit)` - Search products
- `getFeaturedProducts(limit)` - Get featured products
- `getNewArrivals(limit)` - Get new arrivals
- `getRelatedProducts(productId, limit)` - Get related products
- `getProductStats()` - Get product statistics
- `validateProductAvailability(id, quantity, size?, color?)` - Validate product availability

### UserService

**Methods:**
- `createUser(data)` - Create new user
- `getUserById(id)` - Get user by ID
- `getUserByEmail(email)` - Get user by email
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `emailExists(email)` - Check if email exists
- `getUserStats(userId)` - Get user statistics

## Response Format

All API responses follow a standard format:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": {...}
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Response Helpers

```typescript
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse
} from "@/app/lib/api/response"
```

## Authentication

### Require Authentication

```typescript
import { requireAuth } from "@/app/lib/api/middleware"

const { error, user } = await requireAuth(req)
if (error) return error
// Use user.id, user.email, etc.
```

## Rate Limiting

Rate limiting is applied automatically to prevent abuse:

```typescript
import { applyRateLimit } from "@/app/lib/api/middleware"

const rateLimitResponse = applyRateLimit(req, 100, 60000) // 100 requests per minute
if (rateLimitResponse) return rateLimitResponse
```

## Validation

### Request Body Validation

```typescript
import { validateRequest } from "@/app/lib/validation/validate"
import { checkoutSchema } from "@/app/lib/validation/schemas"

const validation = await validateRequest(checkoutSchema, body)
if (!validation.success) return validation.response

const { data } = validation // Validated data
```

### Query Parameter Validation

```typescript
import { validateQuery } from "@/app/lib/validation/validate"
import { productFiltersSchema } from "@/app/lib/validation/schemas"

const validation = await validateQuery(productFiltersSchema, queryParams)
if (!validation.success) return validation.response
```

## Database

### Prisma Client

Use the singleton Prisma client:

```typescript
import { prisma } from "@/app/lib/db/prisma"

const user = await prisma.user.findUnique({ where: { id } })
```

### Transactions

```typescript
import { transaction } from "@/app/lib/db/prisma"

await transaction(async (tx) => {
  // Multiple operations
})
```

## Best Practices

1. **Keep API routes thin** - Delegate to services
2. **Use services for business logic** - Don't put logic in routes
3. **Validate all inputs** - Use Zod schemas
4. **Handle errors gracefully** - Use error response helpers
5. **Use TypeScript** - Type everything
6. **Apply rate limiting** - Prevent abuse
7. **Require auth when needed** - Use middleware
8. **Use transactions** - For multiple related operations
9. **Log errors** - For debugging
10. **Return consistent responses** - Use response helpers

## Adding New Endpoints

1. Create route file in `/app/api/`
2. Import necessary services and utilities
3. Apply middleware (auth, rate limiting)
4. Validate input
5. Call service methods
6. Return standardized response

**Example:**
```typescript
import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/app/lib/services/product-service"
import { successResponse, errorResponse } from "@/app/lib/api/response"
import { requireAuth, applyRateLimit } from "@/app/lib/api/middleware"
import { validateQuery } from "@/app/lib/validation/validate"

export async function GET(req: NextRequest) {
  try {
    const rateLimitResponse = applyRateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    const { error, user } = await requireAuth(req)
    if (error) return error

    // Your logic here
    const data = await ProductService.getProducts()

    return successResponse(data)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
```

## Testing

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Get Products

```bash
curl http://localhost:3000/api/products?category=caps&limit=10
```

## Future Enhancements

- [ ] Add caching layer (Redis)
- [ ] Add comprehensive logging
- [ ] Add request/response logging middleware
- [ ] Add API versioning
- [ ] Add GraphQL support
- [ ] Add WebSocket support for real-time updates
- [ ] Add admin endpoints
- [ ] Add analytics endpoints
- [ ] Add inventory management
- [ ] Add email service integration

