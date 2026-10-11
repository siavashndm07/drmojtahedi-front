import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  FileSpreadsheet,
  HeartHandshake,
  Landmark,
  Scale,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { IconBadge } from "@/components/ui/IconBadge";
import { siteConfig } from "@/config/site";
import { mockFoundationIntro } from "@/lib/mock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "شفافیت و منابع",
  description: "ثبت رسمی، مجوزها و مسیر هزینه‌کرد حمایت‌های خیرخواهانهٔ بنیاد.",
  path: "/transparency",
});

const blocks = [
  {
    title: "هویت حقوقی",
    body: `${mockFoundationIntro.legalName} — ثبت ${toPersianDigits(mockFoundationIntro.registrationNumber)} · شناسه ملی ${toPersianDigits(mockFoundationIntro.nationalId)}.`,
    icon: Landmark,
  },
  {
    title: "مجوز فعالیت",
    body: `مجوز وزارت فرهنگ و ارشاد اسلامی به شماره ${toPersianDigits(mockFoundationIntro.licenseNumber)} مورخ ${toPersianDigits(mockFoundationIntro.licenseDate)}.`,
    icon: BadgeCheck,
  },
  {
    title: "مسیر حمایت‌ها",
    body: "کمک‌های خیرخواهانه صرف برنامه‌های فرهنگی، آموزشی، آرشیو و پروژه‌های عام‌المنفعه می‌شود؛ جزئیات هزینه پس از اتصال سامانهٔ مالی در گزارش سالانه منتشر خواهد شد.",
    icon: HeartHandshake,
  },
  {
    title: "اساس‌نامه",
    body: "چارچوب اهداف، ارکان و منابع درآمد در اساس‌نامهٔ رسمی بنیاد آمده است.",
    icon: Scale,
  },
];

export default function TransparencyPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "شفافیت" }]}
        eyebrow="اعتماد عمومی"
        title="شفافیت و منابع بنیاد"
        description="اطلاعات ثبت، مجوز و مسیر هزینه‌کرد حمایت‌ها — برای همراهی آگاهانه با بنیاد."
        actions={
          <>
            <Link
              href="/foundation/charter"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              اساس‌نامه
            </Link>
            <Link
              href="/donate"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              کمک خیرخواهانه
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-10">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {blocks.map((block) => (
              <li
                key={block.title}
                className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm"
              >
                <IconBadge icon={block.icon} size="lg" />
                <h2 className="mt-4 text-lg font-medium text-ink">{block.title}</h2>
                <p className="mt-3 text-sm leading-8 text-ink-muted">{block.body}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn>
          <section className="rounded-2xl border border-ink/10 bg-mint-soft/40 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <IconBadge icon={FileSpreadsheet} />
              <div>
                <h2 className="text-display text-xl">گزارش سالانه</h2>
                <p className="mt-3 text-sm leading-8 text-ink-muted">
                  فایل PDF گزارش فعالیت و منابع پس از آماده‌سازی در پنل ادمین در
                  همین صفحه منتشر می‌شود. نشانی رسمی: {siteConfig.address}
                </p>
                <Link
                  href="/foundation"
                  className="mt-4 inline-flex text-sm font-semibold text-pine hover:underline"
                >
                  معرفی بنیاد
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
