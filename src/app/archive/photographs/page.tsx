import type { Metadata } from "next";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listArchiveItems } from "@/lib/api/archive";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "عکس‌ها",
  description: "عکس‌ها و آثار تصویری آرشیو بنیاد.",
  path: "/archive/photographs",
});

export default async function PhotographsPage() {
  const items = (await listArchiveItems()).filter(
    (item) => item.type === "photo" || item.type === "object",
  );

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "آرشیو", href: "/archive" },
          { label: "عکس‌ها" },
        ]}
        eyebrow="گالری تصاویر"
        title="عکس‌ها و آثار تصویری"
        description="عکس‌های تاریخی و آثار اهدایی — از جمله تابلوهای استاد محجوبی."
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={items.map((item) => ({
            key: item.id,
            href: `/archive/${item.slug}`,
            title: item.title,
            description: item.description,
            meta: item.collection,
            badge: item.type === "object" ? "اثر" : "عکس",
            comingSoon: item.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
