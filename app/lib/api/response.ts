import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse["meta"]
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    },
    { status: 200 }
  )
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Not found response
 */
export function notFoundResponse(resource: string = "Resource"): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404)
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return errorResponse("Unauthorized", 401)
}

/**
 * Forbidden response
 */
export function forbiddenResponse(): NextResponse<ApiResponse> {
  return errorResponse("Forbidden", 403)
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    },
    { status: 400 }
  )
}

/**
 * Server error response
 */
export function serverErrorResponse(
  error: string = "Internal server error"
): NextResponse<ApiResponse> {
  return errorResponse(error, 500)
}

