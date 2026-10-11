"use client";

import type { ReactNode } from "react";
import SiteAiChatWidget from "@/components/ai/SiteAiChatWidget";
import { AuthUiProvider } from "@/components/auth/AuthUi";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthUiProvider>
          {children}
          <SiteAiChatWidget />
        </AuthUiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
