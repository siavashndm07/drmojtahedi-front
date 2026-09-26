import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "پارک",
  description: "فضای سبز و عمومی مجموعه.",
  path: "/complex/park",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="پارک"
      description="فضای سبز و عمومی مجموعه."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه فرهنگی", href: "/complex" }, { label: "پارک" }]}
      links={undefined}
    />
  );
}
