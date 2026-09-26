import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "مجموعه‌های موزه",
  description: "فهرست مجموعه‌های موزه‌ای.",
  path: "/museum/collections",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="مجموعه‌های موزه"
      description="فهرست مجموعه‌های موزه‌ای."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "موزه", href: "/museum" }, { label: "مجموعه‌ها" }]}
      links={undefined}
    />
  );
}
