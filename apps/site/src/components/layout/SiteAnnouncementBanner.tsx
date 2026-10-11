import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { mergeSiteBanner, type SiteBanner } from "@drmojtahedi/shared";
import { getServerApiUrl, rewritePublicMediaUrl } from "@/lib/api/config";
import { siteSettings } from "@/lib/site-settings";

async function loadSiteBanner(): Promise<SiteBanner> {
  const fallback = mergeSiteBanner(siteSettings.siteBanner);
  const base = getServerApiUrl();
  if (!base) return fallback;
  try {
    const response = await fetch(`${base}/site/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!response.ok) return fallback;
    const data = (await response.json()) as { siteBanner?: Partial<SiteBanner> | null };
    return mergeSiteBanner(data.siteBanner ?? fallback);
  } catch {
    return fallback;
  }
}

export async function SiteAnnouncementBanner() {
  const banner = await loadSiteBanner();
  if (!banner.enabled) return null;

  const mode = banner.mode === "image" ? "image" : "text";
  const imageSrc = rewritePublicMediaUrl(banner.imageUrl?.trim() ?? "");
  const link = banner.link?.trim() ?? "";

  if (mode === "image") {
    if (!imageSrc) return null;
    const image = (
      // eslint-disable-next-line @next/next/no-img-element -- GIF animation needs plain img
      <img
        src={imageSrc}
        alt={banner.message?.trim() || "اعلان سایت"}
        className="mx-auto max-h-24 w-full object-contain sm:max-h-28"
      />
    );
    return (
      <div className="border-b border-ink/10 bg-surface">
        <div className="container-page py-1.5 sm:py-2">
          {link ? (
            <Link href={link} className="block focus-visible:outline-none">
              {image}
            </Link>
          ) : (
            image
          )}
        </div>
      </div>
    );
  }

  if (!banner.message.trim()) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="container-page flex flex-wrap items-center justify-center gap-2 text-center">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        <span>{banner.message}</span>
        {link ? (
          <Link href={link} className="font-semibold underline underline-offset-2">
            {banner.linkLabel || "اطلاعات بیشتر"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
