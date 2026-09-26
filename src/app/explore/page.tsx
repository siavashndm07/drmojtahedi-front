import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کاوش دانش",
  description: "گراف دانش — این بخش در حال توسعه است.",
  path: "/explore",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="کاوش دانش"
      description="گراف دانش — این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "کاوش" }]}
      links={undefined}
    />
  );
}
