"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of wrong theme during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider 
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="sog-theme"
    >
      {children}
    </NextThemesProvider>
  )
}