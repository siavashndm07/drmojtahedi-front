import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Library } from "lucide-react";
import { GatewayGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کتابخانه دیجیتال",
  description: "جستجو در منابع کتابخانه‌ای و کتاب‌های بنیاد.",
  path: "/library",
});

const gateways = [
  {
    href: "/library/books",
    title: "کتاب‌ها",
    description: "انتشارات و منابع مکتوب دربارهٔ دکتر مجتهدی.",
    icon: BookOpen,
  },
  {
    href: "/search?category=library",
    title: "جستجوی منابع",
    description: "کاوش در آرشیو و کتابخانه.",
    icon: Library,
  },
];

export default function LibraryPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "کتابخانه" }]}
        eyebrow="منابع پژوهشی"
        title="کتابخانه دیجیتال"
        description="کتاب‌ها، مقالات و منابع پژوهشی مرتبط با میراث آموزشی دکتر مجتهدی."
        actions={
          <Link
            href="/library/books"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مشاهده کتاب‌ها
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <GatewayGrid items={gateways} />
      </div>
    </div>
  );
}
