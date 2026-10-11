import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listArchiveItems } from "@/lib/api/archive";
import { coverByIndex } from "@/lib/mock/covers";
import type { ArchiveItemType } from "@/lib/types";
import { buildPageMetadata } from "@/lib/seo/metadata";

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

export const metadata: Metadata = buildPageMetadata({
  title: "آرشیو دیجیتال",
  description: "اسناد، عکس‌ها، صوت و تصویر مرتبط با میراث دکتر مجتهدی.",
  path: "/archive",
});

export default async function ArchivePage() {
  const items = await listArchiveItems();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو" }]}
        eyebrow="اسناد و رسانه‌ها"
        title="آرشیو دیجیتال"
        description="اسناد، عکس‌ها، آثار اهدایی و منابع صوتی‌تصویری مرتبط با زندگی و میراث دکتر مجتهدی."
        actions={
          <>
            <Link
              href="/archive/photographs"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              عکس‌ها
            </Link>
            <Link
              href="/archive/video"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              ویدئو
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={items.map((item, index) => {
            const cover = item.thumbnail ?? coverByIndex(index, item.title);
            return {
              key: item.id,
              href: `/archive/${item.slug}`,
              title: item.title,
              description: item.description,
              meta: item.dateLabel,
              badge: typeLabels[item.type],
              comingSoon: item.status === "coming-soon",
              image: { src: cover.src, alt: cover.alt },
            };
          })}
        />
      </div>
    </div>
  );
}
