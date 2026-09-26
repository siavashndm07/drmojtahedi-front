import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آموزش",
  description: "برنامه‌ها، کارگاه‌ها و منابع آموزشی.",
  path: "/education",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="آموزش"
      description="برنامه‌ها، کارگاه‌ها و منابع آموزشی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آموزش" }]}
      links={[{ href: "/education/courses", label: "دوره‌ها" }, { href: "/education/workshops", label: "کارگاه‌ها" }, { href: "/education/resources", label: "منابع" }]}
    />
  );
}
