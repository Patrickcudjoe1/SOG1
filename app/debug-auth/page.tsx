"use client"

import { useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase/config'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function DebugAuthPage() {
  const [status, setStatus] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const forceCleanAuth = async () => {
    setLoading(true)
    setStatus([])
    
    try {
      addStatus('🧹 Starting force clean...')
      
      // Step 1: Sign out from Firebase
      addStatus('1️⃣ Signing out from Firebase...')
      try {
        await signOut(auth)
        addStatus('✅ Firebase sign out successful')
      } catch (error: any) {
        addStatus(`⚠️ Firebase sign out error: ${error.message}`)
      }
      
      // Step 2: Clear backend session
      addStatus('2️⃣ Clearing backend session...')
      try {
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'same-origin'
        })
        addStatus('✅ Backend session cleared')
      } catch (error: any) {
        addStatus(`⚠️ Backend session error: ${error.message}`)
      }
      
      // Step 3: Clear localStorage
      addStatus('3️⃣ Clearing localStorage...')
      localStorage.clear()
      addStatus('✅ localStorage cleared')
      
      // Step 4: Clear sessionStorage
      addStatus('4️⃣ Clearing sessionStorage...')
      sessionStorage.clear()
      addStatus('✅ sessionStorage cleared')
      
      // Step 5: Clear IndexedDB (Firebase uses this)
      addStatus('5️⃣ Clearing IndexedDB...')
      if (window.indexedDB) {
        const databases = await window.indexedDB.databases()
        for (const db of databases) {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name)
            addStatus(`   Deleted: ${db.name}`)
          }
        }
        addStatus('✅ IndexedDB cleared')
      }
      
      addStatus('✅ FORCE CLEAN COMPLETE!')
      addStatus('👉 Redirecting to sign in page in 2 seconds...')
      
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
      
    } catch (error: any) {
      addStatus(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkAuthState = async () => {
    setStatus([])
    addStatus('🔍 Checking auth state...')
    
    const user = auth.currentUser
    if (user) {
      addStatus(`✅ Logged in as: ${user.email}`)
      addStatus(`   UID: ${user.uid}`)
      addStatus(`   Name: ${user.displayName || 'N/A'}`)
      
      try {
        addStatus('🔑 Getting ID token...')
        const token = await user.getIdToken()
        addStatus(`✅ Token obtained (length: ${token.length})`)
        
        addStatus('🔄 Getting fresh ID token...')
        const freshToken = await user.getIdToken(true)
        addStatus(`✅ Fresh token obtained (length: ${freshToken.length})`)
        
        addStatus('📡 Testing token with server...')
        const response = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            idToken: freshToken,
            email: user.email,
            name: user.displayName,
            uid: user.uid
          })
        })
        
        const data = await response.json()
        if (response.ok) {
          addStatus('✅ Token verified successfully by server!')
          addStatus(`   Response: ${JSON.stringify(data)}`)
        } else {
          addStatus(`❌ Server rejected token: ${data.error}`)
          addStatus(`   Status: ${response.status}`)
        }
        
      } catch (error: any) {
        addStatus(`❌ Token error: ${error.message}`)
      }
    } else {
      addStatus('❌ Not logged in')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Auth Debug Tool</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={forceCleanAuth}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              {loading ? '⏳ Processing...' : '🧹 Force Clean Everything & Reset'}
            </button>
            
            <button
              onClick={checkAuthState}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              🔍 Check Current Auth State
            </button>
            
            <button
              onClick={() => router.push('/signin')}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              → Go to Sign In
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
          <h3 className="text-lg font-semibold mb-4 text-white">Console Output</h3>
          {status.length === 0 ? (
            <p className="text-gray-500">No output yet. Click a button above.</p>
          ) : (
            <div className="space-y-1">
              {status.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 How to Use</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
            <li>Click "Force Clean Everything & Reset" to clear all auth data</li>
            <li>Wait for redirect to sign in page</li>
            <li>Sign in with your credentials (fresh session)</li>
            <li>Check if authentication works now</li>
          </ol>
        </div>
      </div>
    </div>
  )
}