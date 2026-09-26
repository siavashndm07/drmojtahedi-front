import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "بلیط",
  description: "این بخش در حال توسعه است.",
  path: "/tickets",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="بلیط"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "بلیط" }]}
      links={undefined}
    />
  );
}
