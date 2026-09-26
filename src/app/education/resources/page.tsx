import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "منابع آموزشی",
  description: "منابع و مطالب تکمیلی.",
  path: "/education/resources",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="منابع آموزشی"
      description="منابع و مطالب تکمیلی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آموزش", href: "/education" }, { label: "منابع" }]}
      links={undefined}
    />
  );
}
