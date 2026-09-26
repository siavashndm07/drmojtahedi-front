import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "دوره‌ها",
  description: "دوره‌های آموزشی.",
  path: "/education/courses",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="دوره‌ها"
      description="دوره‌های آموزشی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آموزش", href: "/education" }, { label: "دوره‌ها" }]}
      links={undefined}
    />
  );
}
