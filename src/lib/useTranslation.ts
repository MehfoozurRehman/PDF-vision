'use client'

import { useUI } from '@/store/ui-store'
import { getTranslation, t, Translations } from './translations'

export function useTranslation() {
  const { state } = useUI()
  const currentLanguage = state.language
  
  const translation = getTranslation(currentLanguage)
  
  const translate = (key: keyof Translations): string => {
    return t(key, currentLanguage)
  }
  
  return {
    t: translate,
    language: currentLanguage,
    translations: translation,
    isRTL: currentLanguage === 'ar'
  }
}