import Link from "next/link";
import { getNavIcon } from "@/components/icons/navIcons";
import { footerColumns, utilityNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { toPersianDigits } from "@/lib/utils/digits";

export function SiteFooter() {
  const year = toPersianDigits(new Date().getFullYear());

  return (
    <footer className="mt-auto border-t border-ink/10 bg-pine-dark text-white">
      <div className="content-wide section-pad !py-12 md:!py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <p className="text-sm text-white/70">{siteConfig.name}</p>
            <p className="text-display text-2xl">{siteConfig.personName}</p>
            <p className="text-sm font-medium text-mint-soft/90">{siteConfig.tagline}</p>
            <p className="max-w-md text-sm leading-7 text-white/75">
              {siteConfig.personRoles.slice(0, 2).join(" · ")}
            </p>
            <p className="max-w-md text-sm leading-7 text-white/60">
              {siteConfig.address}
            </p>
            <p className="text-sm text-white/60">
              تلفن: {toPersianDigits(siteConfig.phone)} · {siteConfig.email}
            </p>
            <form className="flex max-w-md flex-col gap-2 sm:flex-row" action="#" method="post">
              <label className="sr-only" htmlFor="newsletter-email">
                ایمیل خبرنامه
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="ایمیل برای خبرنامه"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white shadow-sm placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pine-dark transition hover:bg-mint-soft"
              >
                عضویت
              </button>
            </form>
            <p className="text-xs text-white/50">
              ارسال ایمیل در این نسخه آزمایشی ذخیره نمی‌شود.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => {
              const ColumnIcon = getNavIcon(column.icon);
              return (
                <div key={column.title}>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <ColumnIcon className="size-4 opacity-80" strokeWidth={1.8} aria-hidden />
                    {column.title}
                  </h2>
                  <ul className="space-y-2">
                    {column.links.map((link) => {
                      const LinkIcon = getNavIcon(link.icon);
                      return (
                        <li key={link.href}>
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
            © {year} {siteConfig.name}
          </p>
          <ul className="flex flex-wrap gap-4">
            {utilityNavigation.slice(0, 4).map((item) => {
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
