import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  statusLabel,
  actions,
  className,
}: {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  statusLabel?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b border-ink/10 bg-surface/50 dark:bg-surface/30", className)}>
      <div className="content-shell section-pad !py-10 md:!py-14">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-6" /> : null}
        <div className="flex flex-wrap items-center gap-3">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {statusLabel ? <Badge tone="placeholder">{statusLabel}</Badge> : null}
        </div>
        <h1 className="text-display mt-3 max-w-4xl text-3xl text-ink md:text-5xl text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-muted md:text-lg">
            {description}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

export function ComingSoonPage({
  title,
  description = "این بخش در حال توسعه است و به‌زودی با محتوای واقعی تکمیل می‌شود.",
  breadcrumbs,
  links,
}: {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  links?: { href: string; label: string }[];
}) {
  return (
    <div>
      <PageHero
        breadcrumbs={breadcrumbs}
        title={title}
        description={description}
        statusLabel="به‌زودی"
      />
      <div className="content-shell section-pad !pt-8">
        <Card padding="lg">
          <p className="text-ink-muted">
            محتوای این صفحه به‌صورت آزمایشی است و حقایق تاریخی تأییدنشده در آن قرار
            نمی‌گیرد.
          </p>
          {links && links.length > 0 ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-ink/10 px-4 py-3 transition-colors hover:border-pine/40 hover:bg-mint-soft hover:text-pine"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
