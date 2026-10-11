import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  hint,
  href,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  tone?: "default" | "warn" | "ok";
  icon?: LucideIcon;
}) {
  const toneClass =
    tone === "warn"
      ? "border-amber-200/80 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10"
      : tone === "ok"
        ? "border-pine/20 bg-mint-soft/50 dark:bg-mint/30"
        : "border-ink/10 bg-surface";

  const iconToneClass =
    tone === "warn"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      : tone === "ok"
        ? "bg-mint-soft text-pine dark:bg-mint dark:text-pine"
        : "bg-cream text-ink-muted dark:bg-cream/20";

  const inner = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-ink">{value}</p>
        {hint ? <p className="mt-2 text-[11px] leading-5 text-ink-muted">{hint}</p> : null}
      </div>
      {Icon ? (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconToneClass}`}
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`block rounded-2xl border p-4 transition hover:border-pine/30 hover:shadow-sm ${toneClass}`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`rounded-2xl border p-4 ${toneClass}`}>{inner}</div>;
}
