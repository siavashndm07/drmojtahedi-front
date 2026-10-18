"use client";

import Link from "next/link";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { getNavIcon } from "@/components/icons/navIcons";
import { utilityNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useSiteSettings } from "@/lib/SiteSettingsProvider";
import { FOOTER_SOCIAL_LINKS, getActiveSocialLinks } from "@/lib/socialLinks";
import { toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";
import { visibleFooterNav } from "@drmojtahedi/shared";

function FooterSocials() {
  const site = useSiteSettings();
  const active = getActiveSocialLinks(site.social);
  const links = FOOTER_SOCIAL_LINKS.map((item) => {
    const found = active.find((a) => a.id === item.id);
    return {
      ...item,
      href: found?.href || "/contact",
      pending: !found?.href,
    };
  });

  return (
    <nav className="flex max-w-md flex-wrap items-center gap-2" aria-label="شبکه‌های اجتماعی">
      {links.map(({ id, Icon, href, labelFa, pending }) => (
        <Link
          key={id}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={pending ? `${labelFa} — به‌زودی` : labelFa}
          title={pending ? `${labelFa} — به‌زودی` : labelFa}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/80 transition hover:border-white/40 hover:bg-white/15 hover:text-white",
            pending && "opacity-55",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  const site = useSiteSettings();
  const year = toPersianDigits(new Date().getFullYear());
  const name = site.nameFa || siteConfig.name;
  const tagline = site.tagline || siteConfig.tagline;
  const address = site.address || siteConfig.address;
  const phone = site.phone || siteConfig.phone;
  const email = site.email || siteConfig.email;
  const columns = visibleFooterNav(site.footerNav);

  return (
    <footer className="mt-auto border-t border-ink/10 bg-pine-dark text-white">
      <div className="content-wide section-pad !py-12 md:!py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <p className="text-sm text-white/70">{name}</p>
            <p className="text-display text-2xl">{siteConfig.personName}</p>
            <p className="text-sm font-medium text-mint-soft/90">{tagline}</p>
            <p className="max-w-md text-sm leading-7 text-white/75">
              {siteConfig.personRoles.slice(0, 2).join(" · ")}
            </p>
            <p className="max-w-md text-sm leading-7 text-white/60">{address}</p>
            <p className="text-sm text-white/60">
              تلفن: {toPersianDigits(phone)} · {email}
            </p>
            <FooterSocials />
            <NewsletterSignup variant="footer" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => {
              const ColumnIcon = getNavIcon(column.icon);
              return (
                <div key={column.id}>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <ColumnIcon className="size-4 opacity-80" strokeWidth={1.8} aria-hidden />
                    {column.title}
                  </h2>
                  <ul className="space-y-2">
                    {column.links.map((link) => {
                      const LinkIcon = getNavIcon(link.icon);
                      return (
                        <li key={`${column.id}-${link.href}-${link.label}`}>
                          <Link
                            href={link.href}
                            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                          >
                            <LinkIcon className="size-3.5 opacity-70" strokeWidth={1.8} aria-hidden />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {name}
          </p>
          <ul className="flex flex-wrap gap-4">
            {utilityNavigation.map((item) => {
              const Icon = getNavIcon(item.icon);
              return (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex items-center gap-1.5 hover:text-white">
                    <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
