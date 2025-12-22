'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/navbar'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 
            className="text-4xl md:text-5xl font-light tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Something went wrong
          </h1>
          <p className="text-sm font-light text-gray-600">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs text-left">
              <p className="font-semibold mb-1">Error Details (Development Only):</p>
              <p>{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs opacity-75">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={reset}
              className="px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase font-light"
              style={{ fontFamily: 'var(--font-brand)' }}
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs tracking-widest uppercase font-light"
              style={{ fontFamily: 'var(--font-brand)' }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

