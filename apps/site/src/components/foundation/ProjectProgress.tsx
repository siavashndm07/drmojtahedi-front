import { toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

export function normalizeProgressPercent(
  value?: number | null,
): number | null {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Math.min(100, Math.max(0, Math.round(Number(value))));
}

export function ProjectProgress({
  value,
  className,
  size = "md",
  showLabel = true,
}: {
  value?: number | null;
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const percent = normalizeProgressPercent(value);
  if (percent == null) return null;

  return (
    <div className={cn("w-full", className)}>
      {showLabel ? (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
          <span className="text-ink-muted">پیشرفت</span>
          <span className="font-semibold tabular-nums text-pine" dir="ltr">
            {toPersianDigits(percent)}٪
          </span>
        </div>
      ) : null}
      <div
        className={cn(
          "overflow-hidden rounded-full bg-ink/10 dark:bg-ink/20",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت ${toPersianDigits(percent)} درصد`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-pine to-mint-deep transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
