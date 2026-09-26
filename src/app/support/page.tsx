import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "حمایت از مجموعه",
  description: "راه‌های حمایت مالی و اهدای آثار.",
  path: "/support",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="حمایت از مجموعه"
      description="راه‌های حمایت مالی و اهدای آثار."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حمایت" }]}
      links={undefined}
    />
  );
}
