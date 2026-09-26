import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "حساب کاربری",
  description: "این بخش در حال توسعه است.",
  path: "/account",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="حساب کاربری"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب" }]}
      links={[{ href: "/account/login", label: "ورود" }, { href: "/account/register", label: "ثبت‌نام" }]}
    />
  );
}
