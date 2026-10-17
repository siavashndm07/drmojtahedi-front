import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const NO_MATCH_TITLE = "نتیجه‌ای پیدا نشد";
export const NO_MATCH_DESCRIPTION =
  "عبارت جستجو یا فیلتر را تغییر دهید تا موارد دیگر دیده شوند.";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  bare = false,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  bare?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        bare
          ? `relative ${className}`
          : `relative overflow-hidden rounded-2xl border border-ink/10 bg-surface ${className}`
      }
    >
      {bare ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mint-soft/80 to-transparent dark:from-mint/20"
        />
      )}
      <div
        className={`relative flex flex-col items-center text-center ${
          compact ? "px-4 py-8" : "px-6 py-14"
        }`}
      >
        <div
          className={`mb-4 grid place-items-center rounded-2xl bg-mint-soft text-pine ring-1 ring-pine/15 dark:bg-mint/30 ${
            compact ? "h-12 w-12" : "h-16 w-16"
          }`}
        >
          <Icon
            className={compact ? "h-5 w-5" : "h-7 w-7"}
            strokeWidth={1.6}
            aria-hidden
          />
        </div>
        <h3 className={`font-semibold text-ink ${compact ? "text-sm" : "text-base"}`}>
          {title}
        </h3>
        {description ? (
          <p
            className={`mt-1.5 max-w-md text-ink-muted ${
              compact ? "text-xs leading-6" : "text-sm leading-7"
            }`}
          >
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
