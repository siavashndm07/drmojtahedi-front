import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Clapperboard, Images } from "lucide-react";
import { ContentCardGrid, GatewayGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listArchiveItems } from "@/lib/api/archive";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "گالری",
  description: "گالری تصاویر و ویدئوی آرشیو بنیاد فرهنگی دکتر مجتهدی.",
  path: "/gallery",
});

const gateways = [
  {
    href: "/archive/photographs",
    title: "گالری تصاویر",
    description: "عکس‌های تاریخی و آثار اهدایی.",
    icon: Camera,
  },
  {
    href: "/archive/video",
    title: "گالری ویدئو",
    description: "فیلم و روایت‌های تصویری.",
    icon: Clapperboard,
  },
  {
    href: "/archive",
    title: "آرشیو کامل",
    description: "اسناد، صوت و سایر رسانه‌ها.",
    icon: Images,
  },
];

export default async function GalleryPage() {
  const highlights = (await listArchiveItems()).filter(
    (item) => item.type === "photo" || item.type === "video" || item.type === "object",
  );

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "گالری" }]}
        eyebrow="آرشیو دیداری"
        title="گالری"
        description="تصاویر و ویدئوهای مرتبط با بنیاد — ادامهٔ بخش گالری در سایت پیشین."
        actions={
          <Link
            href="/archive/photographs"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مشاهده تصاویر
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-12">
        <GatewayGrid items={gateways} />
        <div>
          <h2 className="text-display mb-6 text-2xl">نمونه‌های آرشیو</h2>
          <ContentCardGrid
            items={highlights.map((item) => ({
              key: item.id,
              href: `/archive/${item.slug}`,
              title: item.title,
              description: item.description,
              meta: item.collection,
              badge:
                item.type === "video" ? "ویدئو" : item.type === "object" ? "اثر" : "عکس",
              comingSoon: item.status === "coming-soon",
            }))}
          />
        </div>
      </div>
    </div>
  );
}
