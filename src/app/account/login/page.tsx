import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ورود",
  description: "احراز هویت از طریق Django — هنوز پیاده‌سازی نشده.",
  path: "/account/login",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="ورود"
      description="احراز هویت از طریق Django — هنوز پیاده‌سازی نشده."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب", href: "/account" }, { label: "ورود" }]}
      links={undefined}
    />
  );
}
