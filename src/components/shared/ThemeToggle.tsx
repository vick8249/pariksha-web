"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-10 h-10 ${className || ''}`} />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 ${className || ''}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300" />
      )}
    </button>
  )
}
