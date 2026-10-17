import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import VisitBeacon from "@/components/VisitBeacon";
import { SiteAnnouncementBanner } from "@/components/layout/SiteAnnouncementBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { brandThemeStyleTag, resolveBrandColors } from "@/lib/brand/theme";
import { buildPageMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo/metadata";
import { loadSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const site = await loadSiteSettings();
  const base = buildPageMetadata({});
  return {
    ...base,
    metadataBase: new URL(site.url || siteConfig.url),
    applicationName: site.nameFa || siteConfig.shortName,
    title: site.nameFa || siteConfig.name,
    description: site.tagline || siteConfig.description,
    icons: site.favicon
      ? {
          icon: [{ url: site.favicon }],
          shortcut: [site.favicon],
          apple: [{ url: site.favicon }],
        }
      : undefined,
    keywords: [
      "دکتر مجتهدی",
      "محمدعلی مجتهدی",
      "میراث فرهنگی",
      "موزه",
      "آرشیو دیجیتال",
      "مجموعه فرهنگی",
    ],
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F6F3" },
    { media: "(prefers-color-scheme: dark)", color: "#141312" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeBootScript = `(function(){try{var t=localStorage.getItem('drmojtahedi-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}else{document.documentElement.style.colorScheme='light'}}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await loadSiteSettings();
  const brandThemeCss = brandThemeStyleTag(
    resolveBrandColors(site.brandPaletteId, site.brandColors),
  );

  return (
    <html lang="fa" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <style id="brand-theme" dangerouslySetInnerHTML={{ __html: brandThemeCss }} />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <Providers site={site}>
          <VisitBeacon />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-pine focus:px-4 focus:py-2 focus:text-white"
          >
            پرش به محتوای اصلی
          </a>
          <SiteAnnouncementBanner banner={site.siteBanner} />
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
