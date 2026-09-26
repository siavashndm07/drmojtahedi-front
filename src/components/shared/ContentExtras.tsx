import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CardLink } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function PlaceholderNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-2xl border border-bronze/25 bg-bronze/5 text-sm text-ink-muted",
        compact ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
      role="note"
    >
      <Badge tone="placeholder">محتوای آزمایشی</Badge>
      <p>
        حقایق تاریخی تأییدنشده در این نسخه درج نشده‌اند. منابع واقعی بعداً از آرشیو و
        API بارگذاری می‌شوند.
      </p>
    </div>
  );
}

export function RelatedContent({
  title = "محتوای مرتبط",
  items,
}: {
  title?: string;
  items: { href: string; label: string; meta?: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="border-t border-ink/10 pt-10">
      <h2 className="text-display text-xl text-ink md:text-2xl">{title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <CardLink href={item.href} title={item.label} meta={item.meta} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EditorialQuote({
  children,
  attribution,
}: {
  children: string;
  attribution?: string;
}) {
  return (
    <blockquote className="rounded-2xl border border-pine/15 border-s-4 border-s-pine bg-mint-soft/70 px-5 py-4 dark:bg-mint md:px-8 md:py-6">
      <p className="text-lg leading-9 text-ink md:text-xl">{children}</p>
      {attribution ? (
        <footer className="mt-3 text-sm text-ink-muted">— {attribution}</footer>
      ) : null}
    </blockquote>
  );
}
