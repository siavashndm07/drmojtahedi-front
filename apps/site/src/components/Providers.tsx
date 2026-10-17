"use client";

import type { ReactNode } from "react";
import SiteAiChatWidget from "@/components/ai/SiteAiChatWidget";
import { AuthUiProvider } from "@/components/auth/AuthUi";
import { AuthProvider } from "@/lib/auth";
import { SiteSettingsProvider } from "@/lib/SiteSettingsProvider";
import type { ResolvedSiteSettings } from "@/lib/site-settings";
import { ThemeProvider } from "@/lib/theme";

export function Providers({
  children,
  site,
}: {
  children: ReactNode;
  site: ResolvedSiteSettings;
}) {
  return (
    <ThemeProvider>
      <SiteSettingsProvider site={site}>
        <AuthProvider>
          <AuthUiProvider>
            {children}
            <SiteAiChatWidget />
          </AuthUiProvider>
        </AuthProvider>
      </SiteSettingsProvider>
    </ThemeProvider>
  );
}
