import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آرشیو تصویری",
  description: "ویدیوهای آرشیو.",
  path: "/archive/video",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="آرشیو تصویری"
      description="ویدیوهای آرشیو."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو", href: "/archive" }, { label: "تصویری" }]}
      links={undefined}
    />
  );
}
