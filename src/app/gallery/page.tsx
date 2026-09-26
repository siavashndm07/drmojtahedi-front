import type { Metadata } from "next";
import { Camera, Clapperboard } from "lucide-react";
import { GatewayGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
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
    description: "عکس‌های تاریخی البرز، شریف و رویدادهای بنیاد.",
    icon: Camera,
  },
  {
    href: "/archive/video",
    title: "گالری ویدئو",
    description: "فیلم، مستند و روایت‌های تصویری مرتبط.",
    icon: Clapperboard,
  },
];

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "گالری" }]}
        eyebrow="آرشیو دیداری"
        title="گالری"
        description="ورودی عمومی به آرشیو عکس و ویدئو — همان محتوایی که در بخش آرشیو نیز در دسترس است."
      />
      <div className="content-shell section-pad !pt-8">
        <GatewayGrid items={gateways} />
      </div>
    </div>
  );
}
