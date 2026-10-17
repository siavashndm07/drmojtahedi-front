import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Link2 } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/shared/PageHero";
import { listUsefulLinks } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "پیوندهای مفید",
  description: "پیوند به انجمن‌ها، نهادها و وب‌سایت‌های مرتبط با بنیاد.",
  path: "/links",
});

export default async function UsefulLinksPage() {
  const links = await listUsefulLinks();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "پیوندهای مفید" }]}
        eyebrow="ارتباطات"
        title="پیوندهای مفید"
        description="وب‌سایت‌ها و انجمن‌های مرتبط که ممکن است برای همراهان بنیاد سودمند باشند."
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          {links.length === 0 ? (
            <EmptyState
              icon={Link2}
              title="هنوز پیوندی ثبت نشده"
              description="وب‌سایت‌ها و انجمن‌های مرتبط، پس از انتشار از پنل، اینجا فهرست می‌شوند."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {links.map((link, index) => (
                <li key={String(link.id)}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-4 rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card"
                  >
                    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mint-soft/70">
                      {link.logoImage?.src ? (
                        <Image
                          src={link.logoImage.src}
                          alt={link.logoImage.alt || link.title}
                          fill
                          className="object-contain p-2"
                          sizes="64px"
                        />
                      ) : (
                        <span className="text-sm font-bold text-pine">
                          {toPersianDigits(index + 1)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink group-hover:text-pine">
                        {link.title}
                      </p>
                      <p
                        className="mt-1 truncate text-xs text-ink-muted"
                        dir="ltr"
                      >
                        {link.url}
                      </p>
                    </div>
                    <ExternalLink
                      className="size-4 shrink-0 text-ink-muted transition group-hover:text-pine"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </FadeIn>
        <FadeIn>
          <p className="mt-8 text-sm text-ink-muted">
            برای حمایت از بنیاد به{" "}
            <Link href="/support" className="font-medium text-pine hover:underline">
              صفحه حمایت
            </Link>{" "}
            سر بزنید.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
