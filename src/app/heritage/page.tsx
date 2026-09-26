import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "میراث و تاریخ",
  description: "افراد، مکان‌ها و نهادهای مرتبط.",
  path: "/heritage",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="میراث و تاریخ"
      description="افراد، مکان‌ها و نهادهای مرتبط."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "میراث و تاریخ" }]}
      links={[{ href: "/heritage/people", label: "افراد" }, { href: "/heritage/places", label: "مکان‌ها" }, { href: "/heritage/institutions", label: "نهادها" }]}
    />
  );
}
