import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { listSponsors } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "حامیان",
  description: "حامیان گرامی بنیاد فرهنگی دکتر مجتهدی.",
  path: "/sponsors",
});

export default async function SponsorsPage() {
  const sponsors = await listSponsors();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حامیان" }]}
        eyebrow="سپاس"
        title="حامیان گرامی بنیاد"
        description="افراد و سازمان‌هایی که با همراهی خود، برنامه‌های عام‌المنفعهٔ بنیاد را ممکن می‌سازند."
        actions={
          <Link
            href="/support"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            پیوستن به حامیان
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.id}
                className="flex flex-col items-start rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-mint-soft text-sm font-semibold text-pine">
                  {sponsor.logoLabel ?? sponsor.title.slice(0, 2)}
                </div>
                <Badge tone="bronze" className="mt-4">
                  {sponsor.kind === "organization" ? "سازمانی" : "فردی"}
                </Badge>
                <h2 className="mt-3 text-lg font-medium text-ink">{sponsor.title}</h2>
                {sponsor.description ? (
                  <p className="mt-2 text-sm leading-7 text-ink-muted">
                    {sponsor.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
