"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface DarkModeToggleProps {
  variant?: "adaptive" | "light" | "dark"
}

export function DarkModeToggle({ variant = "adaptive" }: DarkModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  const getButtonStyles = () => {
    if (variant === "light") {
      return "hover:bg-white/10"
    }
    if (variant === "dark") {
      return "hover:bg-black/10"
    }
    return "hover:bg-muted/50"
  }

  const getIconColor = () => {
    if (theme === "dark") {
      return variant === "light" ? "text-white" : "text-yellow-500"
    }
    return variant === "light" ? "text-white" : "text-foreground"
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${getButtonStyles()}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className={`w-5 h-5 ${getIconColor()}`} />
      ) : (
        <Moon className={`w-5 h-5 ${getIconColor()}`} />
      )}
    </button>
  )
}