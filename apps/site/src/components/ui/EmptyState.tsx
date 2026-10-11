import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title = "محتوایی برای نمایش وجود ندارد.",
  description,
  actionHref,
  actionLabel,
  className,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl border border-dashed border-ink/15 bg-surface/60 px-6 py-10",
        className,
      )}
    >
      <h3 className="text-lg font-medium text-ink">{title}</h3>
      {description ? <p className="max-w-xl text-ink-muted">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium transition-colors hover:border-pine/40 hover:text-pine"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
