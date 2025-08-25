'use client'

import { useTranslation } from '@/lib/useTranslation'
import { useEffect } from 'react'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { language, isRTL } = useTranslation()

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, isRTL])

  return (
    <div className={`h-full flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  )
}