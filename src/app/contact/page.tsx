import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "تماس",
  description: "راه‌های ارتباط با بنیاد فرهنگی دکتر مجتهدی.",
  path: "/contact",
});

const rows = [
  { label: "نشانی", value: siteConfig.address },
  { label: "کد پستی", value: toPersianDigits(siteConfig.postalCode) },
  { label: "تلفن ثابت", value: toPersianDigits(siteConfig.phone) },
  { label: "نمابر", value: toPersianDigits(siteConfig.fax) },
  { label: "همراه", value: toPersianDigits(siteConfig.mobile) },
  { label: "ایمیل", value: siteConfig.email },
  { label: "ایمیل جایگزین", value: siteConfig.emailAlt },
];

export default function ContactPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تماس" }]}
        eyebrow="ارتباط"
        title="تماس با بنیاد"
        description="پیام خود را با ما در میان بگذارید؛ در اسرع وقت پاسخ می‌دهیم."
        actions={
          <>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ارسال ایمیل
            </a>
            <Link
              href="/collaborate"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              درخواست همکاری
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <dl className="space-y-4 rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
              {rows.map((row) => (
                <div key={row.label} className="border-b border-ink/5 pb-4 last:border-0 last:pb-0">
                  <dt className="text-xs text-bronze">{row.label}</dt>
                  <dd className="mt-1 text-sm leading-7 text-ink md:text-base">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-2xl border border-ink/10 bg-mint-soft/40 p-6 md:p-8">
              <h2 className="text-display text-xl">اطلاعات رسمی</h2>
              <p className="mt-3 text-sm leading-8 text-ink-muted">{siteConfig.legalName}</p>
              <p className="mt-4 text-sm text-ink-muted">
                شماره ثبت: {toPersianDigits(siteConfig.registrationNumber)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                شناسه ملی: {toPersianDigits(siteConfig.nationalId)}
              </p>
              <Link href="/foundation" className="mt-6 inline-flex text-sm font-medium text-pine hover:underline">
                معرفی کامل بنیاد
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
