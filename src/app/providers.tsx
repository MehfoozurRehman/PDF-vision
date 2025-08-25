"use client";

import { PDFProvider } from "@/store/pdf-store";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { UIProvider } from "@/store/ui-store";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UIProvider>
      <ThemeProvider>
        <PDFProvider>{children}</PDFProvider>
      </ThemeProvider>
    </UIProvider>
  );
}
