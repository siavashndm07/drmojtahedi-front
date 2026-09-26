import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "معماری",
  description: "مفاهیم معماری — بدون ادعای قطعی.",
  path: "/complex/architecture",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="معماری"
      description="مفاهیم معماری — بدون ادعای قطعی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه فرهنگی", href: "/complex" }, { label: "معماری" }]}
      links={undefined}
    />
  );
}
