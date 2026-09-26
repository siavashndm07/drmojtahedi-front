import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "عکس‌ها",
  description: "عکس‌های آرشیوی.",
  path: "/archive/photographs",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="عکس‌ها"
      description="عکس‌های آرشیوی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو", href: "/archive" }, { label: "عکس‌ها" }]}
      links={undefined}
    />
  );
}
