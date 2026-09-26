import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تاریخ شفاهی",
  description: "مصاحبه‌ها، پیاده‌سازی و موضوعات.",
  path: "/oral-history",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="تاریخ شفاهی"
      description="مصاحبه‌ها، پیاده‌سازی و موضوعات."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تاریخ شفاهی" }]}
      links={undefined}
    />
  );
}
