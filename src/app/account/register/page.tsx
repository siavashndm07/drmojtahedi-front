import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ثبت‌نام",
  description: "ثبت‌نام — معماری آماده‌سازی شده.",
  path: "/account/register",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="ثبت‌نام"
      description="ثبت‌نام — معماری آماده‌سازی شده."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب", href: "/account" }, { label: "ثبت‌نام" }]}
      links={undefined}
    />
  );
}
