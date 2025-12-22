import { z, ZodSchema } from "zod"
import { validationErrorResponse } from "../api/response"
import { NextResponse } from "next/server"

/**
 * Validate request body against schema
 */
export async function validateRequest<T>(
  schema: ZodSchema<T>,
  body: unknown
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const data = await schema.parseAsync(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }))

      return {
        success: false,
        response: validationErrorResponse(errors),
      }
    }

    return {
      success: false,
      response: validationErrorResponse([
        { field: "body", message: "Invalid request body" },
      ]),
    }
  }
}

/**
 * Validate query parameters
 */
export async function validateQuery<T>(
  schema: ZodSchema<T>,
  query: Record<string, string | string[] | undefined>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    // Convert query params to proper types
    const parsed: any = {}
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue
      if (Array.isArray(value)) {
        parsed[key] = value.length === 1 ? value[0] : value
      } else {
        // Try to parse as number or boolean
        if (value === "true") parsed[key] = true
        else if (value === "false") parsed[key] = false
        else if (!isNaN(Number(value)) && value !== "") parsed[key] = Number(value)
        else parsed[key] = value
      }
    }

    const data = await schema.parseAsync(parsed)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }))

      return {
        success: false,
        response: validationErrorResponse(errors),
      }
    }

    return {
      success: false,
      response: validationErrorResponse([
        { field: "query", message: "Invalid query parameters" },
      ]),
    }
  }
}

