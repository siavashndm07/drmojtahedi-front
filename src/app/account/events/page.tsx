import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "رویدادهای من",
  description: "این بخش در حال توسعه است.",
  path: "/account/events",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="رویدادهای من"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب", href: "/account" }, { label: "رویدادها" }]}
      links={undefined}
    />
  );
}
