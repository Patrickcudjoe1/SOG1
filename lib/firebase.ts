// Safe Firebase client initialization. Will no-op if env vars are missing.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

let app: FirebaseApp | undefined
let auth: Auth | undefined

export function getFirebaseAuth(): Auth | undefined {
  if (typeof window === "undefined") return undefined

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  if (!apiKey || !authDomain || !projectId || !appId) return undefined

  if (!getApps().length) {
    app = initializeApp({ apiKey, authDomain, projectId, appId })
  }
  auth = getAuth()
  return auth
}


