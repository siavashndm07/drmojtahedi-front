import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getSponsor, listSponsors } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const sponsors = await listSponsors();
  return sponsors.map((sponsor) => ({ slug: sponsor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);
  if (!sponsor) {
    return buildPageMetadata({
      title: "حامی یافت نشد",
      path: `/sponsors/${slug}`,
    });
  }
  return buildPageMetadata({
    title: sponsor.title,
    description: sponsor.description,
    path: `/sponsors/${sponsor.slug}`,
  });
}

export default async function SponsorDetailPage({ params }: Props) {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);
  if (!sponsor) notFound();

  const kindLabel = sponsor.kind === "organization" ? "سازمانی" : "فردی";

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "حامیان", href: "/sponsors" },
          { label: sponsor.title },
        ]}
        eyebrow="حامی بنیاد"
        title={sponsor.title}
        description={sponsor.description}
        statusLabel={sponsor.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <>
            <Link
              href="/sponsors"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              همه حامیان
            </Link>
            <Link
              href="/support"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              پیوستن به حامیان
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ink/10 bg-surface">
            {sponsor.coverImage ? (
              <div className="relative aspect-[16/9] bg-mint-soft">
                <Image
                  src={sponsor.coverImage.src}
                  alt={sponsor.coverImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 48rem"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                <span className="absolute start-5 bottom-5 inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-base font-semibold text-pine shadow-sm">
                  {sponsor.logoLabel ?? sponsor.title.slice(0, 2)}
                </span>
              </div>
            ) : null}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge tone="bronze">{kindLabel}</Badge>
                {sponsor.logoLabel ? (
                  <Badge tone="pine">{sponsor.logoLabel}</Badge>
                ) : null}
              </div>
              <h2 className="mt-5 text-display text-2xl text-ink">{sponsor.title}</h2>
              {sponsor.description ? (
                <p className="mt-4 text-base leading-9 text-ink-muted">
                  {sponsor.description}
                </p>
              ) : null}
              <p className="mt-6 text-sm leading-8 text-ink-muted">
                بنیاد فرهنگی دکتر مجتهدی از همراهی این حامی گرامی سپاسگزار است.
                برنامه‌های آموزشی، فرهنگی و عام‌المنفعه با حمایت افراد و
                سازمان‌هایی مانند ایشان ممکن می‌شود.
              </p>
              {sponsor.source ? (
                <p className="mt-6 text-xs text-ink-muted">منبع: {sponsor.source}</p>
              ) : null}
            </div>
          </article>
        </FadeIn>
      </div>
    </div>
  );
}
