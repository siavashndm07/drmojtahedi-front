import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  className = "",
  children,
  trailing,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-soft to-cream text-pine dark:from-mint dark:to-cream/30">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs leading-5 text-ink-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
