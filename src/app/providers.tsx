'use client'

import React from 'react'
import { PDFProvider } from '@/store/pdf-store'
import { UIProvider } from '@/store/ui-store'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UIProvider>
      <ThemeProvider>
        <PDFProvider>
          {children}
        </PDFProvider>
      </ThemeProvider>
    </UIProvider>
  )
}