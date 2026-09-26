import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تور ۳۶۰ درجه",
  description: "این بخش در حال توسعه است.",
  path: "/virtual-tour",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="تور ۳۶۰ درجه"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تور مجازی" }]}
      links={undefined}
    />
  );
}
