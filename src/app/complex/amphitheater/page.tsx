import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آمفی‌تئاتر",
  description: "فضای اجرای رویدادها. ظرفیت: به‌زودی اعلام می‌شود.",
  path: "/complex/amphitheater",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="آمفی‌تئاتر"
      description="فضای اجرای رویدادها. ظرفیت: به‌زودی اعلام می‌شود."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه فرهنگی", href: "/complex" }, { label: "آمفی‌تئاتر" }]}
      links={[{ href: "/events", label: "رویدادها" }]}
    />
  );
}
