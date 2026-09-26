import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { mockCharterChapters } from "@/lib/mock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "اساس‌نامه بنیاد",
  description: "خلاصهٔ اساس‌نامه بنیاد فرهنگی دکتر مجتهدی.",
  path: "/foundation/charter",
});

export default function CharterPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "معرفی بنیاد", href: "/foundation" },
          { label: "اساس‌نامه" },
        ]}
        eyebrow="اسناد نهادی"
        title="اساس‌نامه بنیاد"
        description="خلاصهٔ فصل‌های اساس‌نامه برای آشنایی عمومی. متن کامل حقوقی پس از انتشار رسمی در همین بخش در دسترس قرار می‌گیرد."
        actions={
          <Link
            href="/foundation/organs"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مشاهده ارکان بنیاد
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ol className="mx-auto max-w-3xl space-y-10">
          {mockCharterChapters.map((chapter, index) => (
            <FadeIn key={chapter.id} delayMs={40 * index}>
              <li id={chapter.id} className="scroll-mt-28">
                <p className="text-xs text-bronze">فصل {toPersianDigits(index + 1)}</p>
                <h2 className="text-display mt-2 text-2xl md:text-3xl">{chapter.title}</h2>
                <p className="mt-4 text-base leading-9 text-ink-muted">{chapter.body}</p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </div>
  );
}
