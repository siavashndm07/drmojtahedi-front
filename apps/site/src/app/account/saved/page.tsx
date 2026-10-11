import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ذخیره‌ها",
  description: "این بخش در حال توسعه است.",
  path: "/account/saved",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="ذخیره‌ها"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب", href: "/account" }, { label: "ذخیره‌ها" }]}
      links={undefined}
    />
  );
}
