import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "افراد",
  description: "دایرکتوری افراد مرتبط با میراث.",
  path: "/heritage/people",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="افراد"
      description="دایرکتوری افراد مرتبط با میراث."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "میراث و تاریخ", href: "/heritage" }, { label: "افراد" }]}
      links={undefined}
    />
  );
}
