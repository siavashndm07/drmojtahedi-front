import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getArchiveItem, listArchiveItems } from "@/lib/api/archive";
import type { ArchiveItemType } from "@/lib/types";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

const typeLabels: Record<ArchiveItemType, string> = {
  document: "سند",
  photo: "عکس",
  audio: "صوتی",
  video: "ویدئو",
  book: "کتاب",
  letter: "نامه",
  certificate: "گواهی",
  object: "شیء",
};

export async function generateStaticParams() {
  const items = await listArchiveItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArchiveItem(slug);
  if (!item) {
    return buildPageMetadata({
      title: "آیتم آرشیو یافت نشد",
      path: `/archive/${slug}`,
    });
  }
  return buildPageMetadata({
    title: item.title,
    description: item.description,
    path: `/archive/${item.slug}`,
  });
}

export default async function ArchiveItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getArchiveItem(slug);
  if (!item) notFound();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "آرشیو", href: "/archive" },
          { label: item.title },
        ]}
        eyebrow={typeLabels[item.type] ?? "آرشیو"}
        title={item.title}
        description={item.description}
        statusLabel={item.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <Link
            href="/archive"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            بازگشت به آرشیو
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge tone="pine">{typeLabels[item.type] ?? item.type}</Badge>
              {item.dateLabel ? <Badge tone="bronze">{item.dateLabel}</Badge> : null}
              {item.collection ? (
                <Badge tone="placeholder">{item.collection}</Badge>
              ) : null}
            </div>
            {item.creator ? (
              <p className="mt-4 text-sm text-ink-muted">
                پدیدآور: {item.creator}
              </p>
            ) : null}
            {item.description ? (
              <p className="mt-6 text-base leading-9 text-ink-muted">
                {item.description}
              </p>
            ) : null}
            {item.source ? (
              <p className="mt-6 text-xs text-ink-muted">منبع: {item.source}</p>
            ) : null}
          </article>
        </FadeIn>
      </div>
    </div>
  );
}
