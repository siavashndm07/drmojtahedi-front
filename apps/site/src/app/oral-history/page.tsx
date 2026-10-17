import type { Metadata } from "next";
import Link from "next/link";
import { Mic } from "lucide-react";
import { OralHistoryPlayer } from "@/components/oral/OralHistoryPlayer";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { listOralHistory } from "@/lib/api/oralHistory";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تاریخ شفاهی",
  description: "مصاحبه‌ها و روایت‌های شفاهی مرتبط با دکتر مجتهدی و میراث آموزشی او.",
  path: "/oral-history",
});

export default async function OralHistoryPage() {
  const interviews = await listOralHistory();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تاریخ شفاهی" }]}
        eyebrow="روایت شنیداری"
        title="تاریخ شفاهی"
        description="مصاحبه‌ها و برخوانی‌های مرتبط با زندگی و کار دکتر مجتهدی — فایل‌های کامل پس از دیجیتالی‌سازی افزوده می‌شوند."
        actions={
          <>
            <Link
              href="/archive"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              آرشیو
            </Link>
            <Link
              href="/contribute"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ارسال خاطره
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-8">
        {interviews.length === 0 ? (
          <EmptyState
            icon={Mic}
            title="هنوز مصاحبه‌ای منتشر نشده"
            description="روایت‌های شفاهی پس از انتشار از پنل اینجا پخش می‌شوند."
          />
        ) : null}
        {interviews.map((interview) => (
          <FadeIn key={interview.id}>
            <OralHistoryPlayer interview={interview} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
