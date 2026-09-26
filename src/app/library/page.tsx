import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کتابخانه دیجیتال",
  description: "جستجو در منابع کتابخانه‌ای.",
  path: "/library",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="کتابخانه دیجیتال"
      description="جستجو در منابع کتابخانه‌ای."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "کتابخانه" }]}
      links={undefined}
    />
  );
}
