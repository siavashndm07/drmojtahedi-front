import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "نمایشگاه‌ها",
  description: "نمایشگاه‌های جاری، آینده و گذشته.",
  path: "/museum/exhibitions",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="نمایشگاه‌ها"
      description="نمایشگاه‌های جاری، آینده و گذشته."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "موزه", href: "/museum" }, { label: "نمایشگاه‌ها" }]}
      links={undefined}
    />
  );
}
