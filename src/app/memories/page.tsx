import type { Metadata } from "next";
import { MemoriesForm } from "@/components/forms/MemoriesForm";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خاطرات",
  description: "ارسال خاطره، عکس و روایت. انتشار پس از بررسی.",
  path: "/memories",
});

export default function MemoriesPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "خاطرات" }]}
        title="خاطرات"
        description="روایت، عکس یا سندی دارید؟ ارسال محتوا به معنی انتشار فوری نیست. محتوا پس از بررسی منتشر خواهد شد."
      />
      <div className="content-shell section-pad !pt-8">
        <MemoriesForm />
      </div>
    </div>
  );
}
