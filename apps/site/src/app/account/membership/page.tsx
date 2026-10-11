import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Building2,
  HeartHandshake,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { IconBadge } from "@/components/ui/IconBadge";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "عضویت",
  description: "ثبت‌نام و عضویت در بنیاد فرهنگی دکتر مجتهدی.",
  path: "/account/membership",
});

const tiers: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "عضو پیوسته",
    description: "عضویت فعال با دسترسی به برنامه‌ها و خبرنامهٔ اختصاصی.",
    icon: UserCheck,
  },
  {
    title: "عضو وابسته",
    description: "همراهی علاقه‌مندان و حامیان بدون تعهد کامل عضویت پیوسته.",
    icon: HeartHandshake,
  },
  {
    title: "عضو افتخاری",
    description: "تشخیص هیئت امناء برای چهره‌های فرهنگی و علمی.",
    icon: Award,
  },
  {
    title: "عضو حقوقی",
    description: "عضویت سازمان‌ها، دانشگاه‌ها و مؤسسات همکار.",
    icon: Building2,
  },
];

export default function MembershipPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "عضویت" },
        ]}
        eyebrow="عضویت در بنیاد"
        title="ثبت‌نام و عضویت"
        description="انواع عضویت مطابق اساس‌نامه بنیاد. ثبت‌نام و ورود با کد یک‌بارمصرف پیامکی انجام می‌شود."
        actions={
          <>
            <Link
              href="/account/register"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ثبت‌نام با پیامک
            </Link>
            <Link
              href="/account/login"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              ورود / حساب کاربری
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-8">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <li
                key={tier.title}
                className="group rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card"
              >
                <IconBadge icon={tier.icon} size="lg" />
                <h2 className="mt-4 text-lg font-medium text-ink group-hover:text-pine">
                  {tier.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  {tier.description}
                </p>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn>
          <p className="text-sm text-ink-muted">
            جزئیات حقوقی عضویت را در{" "}
            <Link href="/foundation/charter" className="font-medium text-pine hover:underline">
              اساس‌نامه
            </Link>{" "}
            و معرفی{" "}
            <Link href="/foundation/organs" className="font-medium text-pine hover:underline">
              ارکان بنیاد
            </Link>{" "}
            ببینید.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
