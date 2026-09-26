import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تماس",
  description: "راه‌های ارتباط با بنیاد.",
  path: "/contact",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="تماس"
      description="راه‌های ارتباط با بنیاد."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تماس" }]}
      links={undefined}
    />
  );
}
