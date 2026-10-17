"use client";

import { createContext, useContext, type ReactNode } from "react";
import { siteSettings, type ResolvedSiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<ResolvedSiteSettings>(siteSettings);

export function SiteSettingsProvider({
  site,
  children,
}: {
  site: ResolvedSiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={site}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): ResolvedSiteSettings {
  return useContext(SiteSettingsContext);
}
