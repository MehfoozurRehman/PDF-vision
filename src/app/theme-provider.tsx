'use client'

import { useEffect } from 'react'
import { useUI } from '@/store/ui-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state } = useUI()

  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Apply theme class based on state
    if (state.theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(state.theme)
    }
  }, [state.theme])

  return <>{children}</>
}