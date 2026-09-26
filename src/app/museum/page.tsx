import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "موزه",
  description: "صفحه اصلی موزه دیجیتال و فیزیکی.",
  path: "/museum",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="موزه"
      description="صفحه اصلی موزه دیجیتال و فیزیکی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "موزه" }]}
      links={[{ href: "/museum/collections", label: "مجموعه‌ها" }, { href: "/museum/exhibitions", label: "نمایشگاه‌ها" }, { href: "/museum/visit", label: "بازدید" }]}
    />
  );
}
