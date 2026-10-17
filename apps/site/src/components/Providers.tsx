"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
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
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: "!rounded-xl !bg-surface !text-ink !shadow-lg !border !border-ink/10",
                duration: 4000,
              }}
            />
          </AuthUiProvider>
        </AuthProvider>
      </SiteSettingsProvider>
    </ThemeProvider>
  );
}
