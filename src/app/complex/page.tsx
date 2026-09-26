import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "مجموعه فرهنگی",
  description: "چشم‌انداز مجموعه فرهنگی حدود ۴۰۰۰ مترمربع.",
  path: "/complex",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="مجموعه فرهنگی"
      description="چشم‌انداز مجموعه فرهنگی حدود ۴۰۰۰ مترمربع."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه فرهنگی" }]}
      links={[{ href: "/complex/facilities", label: "فضاها" }, { href: "/complex/architecture", label: "معماری" }, { href: "/complex/park", label: "پارک" }, { href: "/complex/amphitheater", label: "آمفی‌تئاتر" }]}
    />
  );
}
