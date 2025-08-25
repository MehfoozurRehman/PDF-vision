"use client";

import { Translations, getTranslation, t } from "./translations";

import { useUI } from "@/store/ui-store";

export function useTranslation() {
  const { state } = useUI();
  const currentLanguage = state.language;

  const translation = getTranslation(currentLanguage);

  const translate = (key: keyof Translations): string => {
    return t(key, currentLanguage);
  };

  return {
    t: translate,
    language: currentLanguage,
    translations: translation,
    isRTL: currentLanguage === "ar",
  };
}
