import type { Metadata } from "next";
import Image from "next/image";
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
              <li key={sponsor.id}>
                <Link
                  href={`/sponsors/${sponsor.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:border-pine/35 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-mint-soft">
                    {sponsor.coverImage ? (
                      <Image
                        src={sponsor.coverImage.src}
                        alt={sponsor.coverImage.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                    <span className="absolute start-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-pine shadow-sm">
                      {sponsor.logoLabel ?? sponsor.title.slice(0, 2)}
                    </span>
                  </div>
                  <div className="p-5">
                    <Badge tone="bronze">
                      {sponsor.kind === "organization" ? "سازمانی" : "فردی"}
                    </Badge>
                    <h2 className="mt-3 text-lg font-medium text-ink transition group-hover:text-pine">
                      {sponsor.title}
                    </h2>
                    {sponsor.description ? (
                      <p className="mt-2 text-sm leading-7 text-ink-muted">
                        {sponsor.description}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-block text-sm font-semibold text-mint-deep">
                      صفحهٔ حامی
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
