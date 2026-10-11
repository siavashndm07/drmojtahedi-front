import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { InteractiveTimeline } from "@/components/timeline/InteractiveTimeline";
import { listTimeline } from "@/lib/api/people";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خط زمان",
  description:
    "خط زمان زندگی دکتر محمدعلی مجتهدی گیلانی — از لاهیجان و تحصیل در فرانسه تا البرز و دانشگاه شریف.",
  path: "/about/timeline",
});

export default async function TimelinePage() {
  const events = await listTimeline();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "دکتر مجتهدی", href: "/about" },
          { label: "خط زمان" },
        ]}
        eyebrow="روایت زمانی"
        title="مسیر زندگی در خط زمان"
        description="از تولد در لاهیجان تا ریاست البرز و بنیان‌گذاری دانشگاه صنعتی شریف. هر نقطه را انتخاب کنید تا جزئیات و پیوندهای مرتبط را ببینید."
        actions={
          <Link
            href="/about/biography"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            بازگشت به زندگی‌نامه
          </Link>
        }
      />

      <div className="content-wide section-pad !pt-8">
        <FadeIn>
          <InteractiveTimeline events={events} />
        </FadeIn>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-ink-muted">
          تاریخ‌ها و مسئولیت‌ها بر اساس منابع عمومی مستند تنظیم شده‌اند. با اتصال آرشیو
          دیجیتال، اسناد و عکس‌های مرتبط به هر گره افزوده می‌شوند.
        </p>
      </div>
    </div>
  );
}
