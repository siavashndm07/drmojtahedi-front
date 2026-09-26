import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "فضاها و امکانات",
  description: "نقشه و معرفی فضاهای مجموعه.",
  path: "/complex/facilities",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="فضاها و امکانات"
      description="نقشه و معرفی فضاهای مجموعه."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه فرهنگی", href: "/complex" }, { label: "فضاها" }]}
      links={undefined}
    />
  );
}
