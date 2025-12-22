import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { AdminService } from "@/app/lib/services/admin-service"
import { unauthorizedResponse, forbiddenResponse } from "./response"

/**
 * Require admin authentication
 */
export async function requireAdmin(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: unauthorizedResponse(),
      user: null,
    }
  }

  const isAdmin = await AdminService.isAdmin(user.id)

  if (!isAdmin) {
    return {
      error: forbiddenResponse(),
      user: null,
    }
  }

  return {
    error: null,
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || null,
    },
  }
}

/**
 * Require super admin authentication
 */
export async function requireSuperAdmin(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: unauthorizedResponse(),
      user: null,
    }
  }

  const isSuperAdmin = await AdminService.isSuperAdmin(user.id)

  if (!isSuperAdmin) {
    return {
      error: forbiddenResponse(),
      user: null,
    }
  }

  return {
    error: null,
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || null,
    },
  }
}

