import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "مکان‌ها",
  description: "مکان‌های تاریخی و فرهنگی مرتبط.",
  path: "/heritage/places",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="مکان‌ها"
      description="مکان‌های تاریخی و فرهنگی مرتبط."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "میراث و تاریخ", href: "/heritage" }, { label: "مکان‌ها" }]}
      links={undefined}
    />
  );
}
