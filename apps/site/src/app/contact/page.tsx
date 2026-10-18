import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { ContactMap } from "@/components/contact/ContactMap";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getActiveSocialLinks } from "@/lib/socialLinks";
import { loadSiteSettings } from "@/lib/site-settings";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "تماس",
  description: "راه‌های ارتباط با بنیاد فرهنگی دکتر مجتهدی.",
  path: "/contact",
});

function telHref(phone: string, href?: string) {
  const explicit = href?.trim();
  if (explicit) return explicit;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

function ContactCard({
  icon,
  label,
  children,
  href,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <span className="flex size-10 items-center justify-center rounded-xl bg-mint-soft text-pine">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-bronze">{label}</span>
        <span className="mt-1 block text-sm leading-7 text-ink">{children}</span>
      </span>
    </>
  );

  const className =
    "flex items-start gap-3 rounded-2xl border border-ink/10 bg-surface p-4 transition hover:border-pine/30";

  if (href) {
    return (
      <a href={href} className={className}>
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
}

export default async function ContactPage() {
  const site = await loadSiteSettings();
  const email = site.email || siteConfig.email;
  const phone = site.phone || siteConfig.phone;
  const mobile = site.phoneSecondary || siteConfig.mobile;
  const address = site.address || siteConfig.address;
  const hours = site.contactHours.trim();
  const description =
    site.contactDescription.trim() ||
    "پیام خود را با ما در میان بگذارید؛ در اسرع وقت پاسخ می‌دهیم.";
  const hasMap = typeof site.mapLat === "number" && typeof site.mapLon === "number";
  const mapHref = hasMap
    ? `https://www.openstreetmap.org/?mlat=${site.mapLat}&mlon=${site.mapLon}#map=16/${site.mapLat}/${site.mapLon}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  const socials = getActiveSocialLinks(site.social);

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تماس" }]}
        eyebrow="ارتباط"
        title="تماس با بنیاد"
        description={description}
        actions={
          <>
            <a
              href={`mailto:${email}`}
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ارسال ایمیل
            </a>
            <a
              href={telHref(phone, site.phoneHref)}
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              تماس تلفنی
            </a>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <ContactCard
                icon={<Phone className="size-4" aria-hidden />}
                label="تلفن ثابت"
                href={telHref(phone, site.phoneHref)}
              >
                <span dir="ltr" className="inline-block">
                  {toPersianDigits(phone)}
                </span>
              </ContactCard>
              <ContactCard
                icon={<Phone className="size-4" aria-hidden />}
                label="همراه"
                href={telHref(mobile)}
              >
                <span dir="ltr" className="inline-block">
                  {toPersianDigits(mobile)}
                </span>
              </ContactCard>
              <ContactCard
                icon={<Mail className="size-4" aria-hidden />}
                label="ایمیل"
                href={`mailto:${email}`}
              >
                <span dir="ltr" className="inline-block">
                  {email}
                </span>
              </ContactCard>
              {hours ? (
                <ContactCard icon={<Clock className="size-4" aria-hidden />} label="ساعات پاسخگویی">
                  {hours}
                </ContactCard>
              ) : (
                <ContactCard icon={<Phone className="size-4" aria-hidden />} label="نمابر">
                  <span dir="ltr" className="inline-block">
                    {toPersianDigits(siteConfig.fax)}
                  </span>
                </ContactCard>
              )}
              <div className="rounded-2xl border border-ink/10 bg-surface p-4 sm:col-span-2">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-bronze">نشانی</p>
                    <p className="mt-1 text-sm leading-7 text-ink">{address}</p>
                    <p className="mt-2 text-xs text-ink-muted">
                      کد پستی {toPersianDigits(siteConfig.postalCode)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm">
              {hasMap ? (
                <ContactMap lat={site.mapLat as number} lon={site.mapLon as number} label={address} />
              ) : (
                <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 bg-gradient-to-br from-mint-soft via-cream to-pine/10 px-6 text-center">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-pine shadow-sm">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <p className="max-w-sm text-sm leading-7 text-ink-muted">
                    نقشهٔ موقعیت بنیاد پس از ثبت مختصات در تنظیمات سایت اینجا قرار می‌گیرد.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-4 py-3">
                <p className="text-sm font-medium text-ink">{site.nameFa || siteConfig.name}</p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-pine px-3 py-1.5 text-xs font-medium text-white hover:bg-pine-dark"
                >
                  <Navigation className="size-3.5" aria-hidden />
                  مسیریابی
                </a>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl border border-ink/10 bg-mint-soft/40 p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
            <div>
              <h2 className="text-display text-xl">اطلاعات رسمی</h2>
              <p className="mt-2 text-sm leading-7 text-ink-muted">
                {site.nameFa || siteConfig.legalName}
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                شماره ثبت: {toPersianDigits(siteConfig.registrationNumber)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                شناسه ملی: {toPersianDigits(siteConfig.nationalId)}
              </p>
              <Link href="/foundation" className="mt-4 inline-flex text-sm font-medium text-pine hover:underline">
                معرفی کامل بنیاد
              </Link>
            </div>
            {socials.length ? (
              <div>
                <h2 className="text-sm font-medium text-ink">شبکه‌های اجتماعی</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socials.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs text-ink hover:border-pine/30"
                      >
                        <item.Icon className="size-3.5" aria-hidden />
                        {item.labelFa}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
