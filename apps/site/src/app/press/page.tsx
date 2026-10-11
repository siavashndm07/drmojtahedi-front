import type { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  FileText,
  ImageIcon,
  Mail,
  Newspaper,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { IconBadge } from "@/components/ui/IconBadge";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "رسانه و کیت خبری",
  description: "بیوگرافی کوتاه، لوگو، عکس‌های کلیدی و تماس رسانه‌ای بنیاد فرهنگی دکتر مجتهدی.",
  path: "/press",
});

const kits = [
  {
    title: "بیوگرافی کوتاه",
    description: `${siteConfig.personTitle} (${siteConfig.birthYear}–${siteConfig.deathYear}) — ${siteConfig.personRoles.slice(0, 2).join("؛ ")}.`,
    icon: FileText,
    href: "/about/biography",
    cta: "زندگی‌نامه",
  },
  {
    title: "بیوگرافی بلند",
    description: "روایت مستند زندگی، البرز و بنیان‌گذاری شریف برای گزارش‌های خبری.",
    icon: Newspaper,
    href: "/about/biography",
    cta: "مطالعه",
  },
  {
    title: "عکس‌های کلیدی",
    description: "تصاویر آرشیوی و گالری برای استفادهٔ رسانه‌ای با ذکر منبع.",
    icon: ImageIcon,
    href: "/archive/photographs",
    cta: "گالری تصاویر",
  },
  {
    title: "اخبار و اطلاعیه‌ها",
    description: "آخرین اخبار رسمی بنیاد برای بازنشر.",
    icon: Download,
    href: "/news",
    cta: "اخبار",
  },
];

export default function PressPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "رسانه" }]}
        eyebrow="کیت خبری"
        title="رسانه و مطبوعات"
        description="منابع آماده برای خبرنگاران و همکاران رسانه‌ای — بیوگرافی، تصاویر و تماس رسمی."
        actions={
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("درخواست رسانه")}`}
            className="inline-flex items-center gap-2 rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            <Mail className="size-4" aria-hidden />
            تماس رسانه‌ای
          </a>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-10">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {kits.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
                >
                  <IconBadge icon={item.icon} size="lg" />
                  <h2 className="mt-4 text-lg font-medium group-hover:text-pine">
                    {item.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-ink-muted">
                    {item.description}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-pine">{item.cta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn>
          <section className="rounded-2xl border border-ink/10 bg-mint-soft/40 p-6 md:p-8">
            <h2 className="text-display text-xl">ذکر منبع</h2>
            <p className="mt-3 text-sm leading-8 text-ink-muted">
              لطفاً در بازنشر، نام «{siteConfig.name}» و در صورت امکان پیوند به
              صفحهٔ مربوط ذکر شود. برای لوگوی رسمی و فایل‌های چاپی پس از پنل
              ادمین، بستهٔ دانلودی اضافه خواهد شد.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              ایمیل: {siteConfig.email} · تلفن: {siteConfig.phone}
            </p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
