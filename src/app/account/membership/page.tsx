import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "عضویت",
  description: "این بخش در حال توسعه است.",
  path: "/account/membership",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="عضویت"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حساب", href: "/account" }, { label: "عضویت" }]}
      links={undefined}
    />
  );
}
