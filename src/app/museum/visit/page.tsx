import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "بازدید از موزه",
  description: "ساعات، دسترسی و نکات بازدید موزه.",
  path: "/museum/visit",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="بازدید از موزه"
      description="ساعات، دسترسی و نکات بازدید موزه."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "موزه", href: "/museum" }, { label: "بازدید" }]}
      links={[{ href: "/visit", label: "راهنمای بازدید مجموعه" }]}
    />
  );
}
