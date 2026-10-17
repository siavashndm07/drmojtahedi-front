import type { Metadata } from "next";
import Link from "next/link";
import {
  FileHeart,
  HandHeart,
  HeartHandshake,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { IconBadge } from "@/components/ui/IconBadge";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { loadSiteSettings } from "@/lib/site-settings";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "حمایت و کمک‌های خیرخواهانه",
  description: "راه‌های حمایت مالی و اهدای آثار به بنیاد فرهنگی دکتر مجتهدی.",
  path: "/support",
});

const ways: {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}[] = [
  {
    title: "کمک‌های خیرخواهانه",
    description:
      "حمایت مالی از برنامه‌های فرهنگی عام‌المنفعهٔ بنیاد. فرم اهدا و انتخاب هدف کمک — ورود با پیامک برای ثبت نهایی.",
    href: "/donate",
    cta: "پرداخت کمک",
    icon: HeartHandshake,
  },
  {
    title: "اهدای سند و کتاب",
    description: "سپردن اسناد، عکس و کتاب مرتبط با دکتر مجتهدی و البرز به آرشیو بنیاد.",
    href: "/collaborate",
    cta: "درخواست اهداء",
    icon: FileHeart,
  },
  {
    title: "اهدای اثر هنری",
    description:
      "مانند اهدای آثار استاد محجوبی؛ سپردن آثار برای اهداف آموزشی و یادمان/موزه.",
    href: "/news/ehdaye-asar-mahjoobi",
    cta: "نمونهٔ اهداء",
    icon: Palette,
  },
  {
    title: "پیوستن به حامیان",
    description: "اسپانسرشیپ فردی یا سازمانی برنامه‌ها و پروژه‌های بنیاد.",
    href: "/sponsors",
    cta: "مشاهده حامیان",
    icon: HandHeart,
  },
];

export default async function SupportPage() {
  const site = await loadSiteSettings();
  const tagline = site.tagline || siteConfig.tagline;
  const address = site.address || siteConfig.address;
  const phone = site.phone || siteConfig.phone;
  const mobile = site.phoneSecondary || siteConfig.mobile;
  const email = site.email || siteConfig.email;

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حمایت" }]}
        eyebrow="حمایت"
        title="کمک‌های خیرخواهانه"
        description={`${tagline}. حمایت مالی، اهدای سند و کتاب، یا همراهی داوطلبانه با بنیاد فرهنگی دکتر مجتهدی.`}
        actions={
          <>
            <Link
              href="/donate"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              کمک خیرخواهانه
            </Link>
            <Link
              href="/account/membership"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              عضویت در بنیاد
            </Link>
            <Link
              href="/transparency"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              شفافیت
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-10">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <li key={way.title}>
                <Link
                  href={way.href}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
                >
                  <div>
                    <IconBadge icon={way.icon} size="lg" />
                    <h2 className="mt-4 text-lg font-medium group-hover:text-pine">
                      {way.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-ink-muted">
                      {way.description}
                    </p>
                  </div>
                  <span className="mt-5 text-sm font-semibold text-pine">{way.cta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn>
          <section className="rounded-2xl border border-ink/10 bg-mint-soft/40 p-6 md:p-8">
            <h2 className="text-display text-xl">اطلاعات تماس برای حمایت</h2>
            <p className="mt-3 text-sm leading-8 text-ink-muted">{address}</p>
            <p className="mt-2 text-sm text-ink-muted">
              تلفن: {toPersianDigits(phone)} · همراه:{" "}
              {toPersianDigits(mobile)}
            </p>
            <p className="mt-1 text-sm text-ink-muted">ایمیل: {email}</p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
