import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خبرنامه",
  description: "عضویت در خبرنامهٔ بنیاد فرهنگی دکتر مجتهدی برای اطلاعیه‌ها و برنامه‌ها.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "خبرنامه" }]}
        eyebrow="اطلاع‌رسانی"
        title="خبرنامهٔ بنیاد"
        description="تازه‌های اخبار، فراخوان‌ها و برنامه‌های فرهنگی را با ایمیل دریافت کنید."
        actions={
          <Link
            href="/news"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            اخبار بنیاد
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm md:p-8">
            <h2 className="text-display text-xl text-ink">عضویت با ایمیل</h2>
            <p className="mt-3 text-sm leading-8 text-ink-muted">
              تا راه‌اندازی پنل ادمین، عضویت به‌صورت آزمایشی روی دستگاه شما ذخیره
              می‌شود و ارسال واقعی انجام نمی‌شود.
            </p>
            <div className="mt-6">
              <NewsletterSignup variant="page" />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
