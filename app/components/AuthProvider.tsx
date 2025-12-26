"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChange } from '@/app/lib/firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Sync Firebase auth with backend session BEFORE setting user
        try {
          console.log('🔄 Syncing Firebase session with backend...')
          // Always force token refresh to avoid expiration issues
          const idToken = await firebaseUser.getIdToken(true)
          console.log('🎫 Fresh token obtained')
          const response = await fetch('/api/auth/sync-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ 
              idToken, // Send ID token for server-side verification
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              uid: firebaseUser.uid
            }),
          })
          
          const data = await response.json()
          
          if (response.ok) {
            console.log('✅ Session synced successfully:', data)
            // Only set user after successful sync
            setUser(firebaseUser)
          } else {
            console.error('❌ Session sync failed:', {
              status: response.status,
              statusText: response.statusText,
              error: data.error || 'Unknown error',
              data
            })
            
            // If token expired, try to refresh and retry once
            if (response.status === 401 && data.error?.includes('expired')) {
              console.log('🔄 Token expired, refreshing and retrying...')
              try {
                const freshToken = await firebaseUser.getIdToken(true)
                const retryResponse = await fetch('/api/auth/sync-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({ 
                    idToken: freshToken,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    uid: firebaseUser.uid
                  }),
                })
                
                const retryData = await retryResponse.json()
                if (retryResponse.ok) {
                  console.log('✅ Session synced successfully on retry:', retryData)
                  setUser(firebaseUser)
                } else {
                  console.error('❌ Retry also failed:', retryData)
                  setUser(firebaseUser) // Still set user
                }
              } catch (retryError) {
                console.error('❌ Retry failed:', retryError)
                setUser(firebaseUser) // Still set user
              }
            } else {
              // For other errors, still set user but session may not work
              setUser(firebaseUser)
            }
          }
        } catch (error) {
          console.error('❌ Failed to sync session:', error)
          // Still set user but session may not work
          setUser(firebaseUser)
        }
      } else {
        // Clear backend session when user signs out
        try {
          await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'same-origin',
          })
        } catch (error) {
          console.error('Failed to clear backend session:', error)
        }
        setUser(null)
      }
      
      // Set loading to false AFTER sync is complete
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}