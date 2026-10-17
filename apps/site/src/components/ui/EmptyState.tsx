import Link from "next/link";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon: Icon = Inbox,
  title = "محتوایی برای نمایش وجود ندارد.",
  description,
  actionHref,
  actionLabel,
  className,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink/10 bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mint-soft/80 to-transparent"
      />
      <div className="relative flex flex-col items-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-mint-soft text-pine ring-1 ring-pine/15">
          <Icon className="h-7 w-7" strokeWidth={1.6} aria-hidden />
        </div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mt-1.5 max-w-md text-sm leading-7 text-ink-muted">{description}</p>
        ) : null}
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="btn-primary mt-5">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
