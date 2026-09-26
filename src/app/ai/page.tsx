import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "دستیار هوشمند آرشیو",
  description: "این بخش در حال توسعه است.",
  path: "/ai",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="دستیار هوشمند آرشیو"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "دستیار هوشمند" }]}
      links={undefined}
    />
  );
}
