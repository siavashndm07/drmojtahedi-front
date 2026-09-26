import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "نهادها",
  description: "نهادها و مؤسسات مرتبط.",
  path: "/heritage/institutions",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="نهادها"
      description="نهادها و مؤسسات مرتبط."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "میراث و تاریخ", href: "/heritage" }, { label: "نهادها" }]}
      links={undefined}
    />
  );
}
