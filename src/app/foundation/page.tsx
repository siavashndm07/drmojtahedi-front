import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileText, Users } from "lucide-react";
import { GatewayGrid } from "@/components/foundation/ContentCards";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { mockFoundationIntro } from "@/lib/mock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "معرفی بنیاد",
  description: mockFoundationIntro.summary,
  path: "/foundation",
});

const gateways = [
  {
    href: "/foundation/charter",
    title: "اساس‌نامه",
    description: "خلاصهٔ هویت، اهداف، ارکان و منابع بنیاد.",
    icon: FileText,
  },
  {
    href: "/foundation/organs",
    title: "ارکان بنیاد",
    description: "هیئت موسس، اعضا و نمایندگان منطقه‌ای.",
    icon: Users,
  },
  {
    href: "/library/books",
    title: "کتاب‌ها",
    description: "انتشارات و منابع مرتبط با دکتر مجتهدی.",
    icon: BookOpen,
  },
];

export default function FoundationPage() {
  const info = mockFoundationIntro;

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "معرفی بنیاد" }]}
        eyebrow="بنیاد"
        title={info.title}
        description={`${info.tagline}. ${info.summary}`}
        actions={
          <>
            <Link
              href="/support"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              حمایت از بنیاد
            </Link>
            <Link
              href="/account/membership"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              عضویت
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-12">
        <FadeIn>
          <div className="rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <p className="text-base leading-9 text-ink-muted">{info.history}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-xs text-bronze">نام رسمی</dt>
                <dd className="mt-1 text-sm text-ink">{info.legalName}</dd>
              </div>
              <div>
                <dt className="text-xs text-bronze">سال تأسیس</dt>
                <dd className="mt-1 text-sm text-ink">{info.foundedYear}</dd>
              </div>
              <div>
                <dt className="text-xs text-bronze">شماره ثبت</dt>
                <dd className="mt-1 text-sm text-ink">
                  {toPersianDigits(info.registrationNumber)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-bronze">شناسه ملی</dt>
                <dd className="mt-1 text-sm text-ink">
                  {toPersianDigits(info.nationalId)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-bronze">مجوز ارشاد</dt>
                <dd className="mt-1 text-sm text-ink">
                  {toPersianDigits(info.licenseNumber)} · {toPersianDigits(info.licenseDate)}
                </dd>
              </div>
            </dl>
          </div>
        </FadeIn>

        <GatewayGrid items={gateways} />

        <FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {info.sections.map((section) => (
              <section
                key={section.id}
                className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm"
              >
                <h2 className="text-display text-xl text-ink">{section.title}</h2>
                <p className="mt-3 text-sm leading-8 text-ink-muted">{section.body}</p>
              </section>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
