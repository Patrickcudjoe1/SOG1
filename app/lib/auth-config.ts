// Compatibility file for auth-config imports
// This file provides the same interface as the expected auth-config
import { getSession, requireAuth } from "./auth"

// Export auth object with getSession method for compatibility
export const auth = {
  getSession,
  requireAuth,
}

// Also export functions directly for convenience
export { getSession, requireAuth }

