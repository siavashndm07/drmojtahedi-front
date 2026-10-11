import type { Metadata } from "next";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listArchiveItems } from "@/lib/api/archive";
import { coverByIndex } from "@/lib/mock/covers";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ویدئو",
  description: "فیلم و ویدئوهای آرشیو بنیاد.",
  path: "/archive/video",
});

export default async function VideoPage() {
  const items = (await listArchiveItems()).filter((item) => item.type === "video");

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "آرشیو", href: "/archive" },
          { label: "تصویری" },
        ]}
        eyebrow="گالری ویدئو"
        title="آرشیو ویدئو"
        description="فیلم‌ها و روایت‌های تصویری مرتبط با بنیاد و میراث دکتر مجتهدی."
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={items.map((item, index) => {
            const cover = item.thumbnail ?? coverByIndex(index + 4, item.title);
            return {
              key: item.id,
              href: `/archive/${item.slug}`,
              title: item.title,
              description: item.description,
              meta: item.collection,
              badge: "ویدئو",
              comingSoon: item.status === "coming-soon",
              image: { src: cover.src, alt: cover.alt },
            };
          })}
        />
      </div>
    </div>
  );
}
