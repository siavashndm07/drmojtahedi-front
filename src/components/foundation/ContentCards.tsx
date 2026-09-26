import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils/cn";

export function GatewayGrid({
  items,
}: {
  items: {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <FadeIn>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-44 flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
          >
            <IconBadge icon={item.icon} />
            <div>
              <h2 className="text-xl font-medium group-hover:text-pine">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </FadeIn>
  );
}

export function ContentCardGrid({
  items,
  columns = "md:grid-cols-2 lg:grid-cols-3",
}: {
  items: {
    key: string;
    href?: string;
    title: string;
    description?: string;
    meta?: string;
    badge?: string;
    comingSoon?: boolean;
  }[];
  columns?: string;
}) {
  return (
    <ul className={cn("grid gap-4", columns)}>
      {items.map((item) => {
        const inner = (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {item.badge ? <Badge tone="pine">{item.badge}</Badge> : null}
              {item.comingSoon ? <Badge tone="placeholder">به‌زودی</Badge> : null}
            </div>
            <h3 className="mt-3 text-lg font-medium text-ink group-hover:text-pine">
              {item.title}
            </h3>
            {item.meta ? <p className="mt-1 text-xs text-bronze">{item.meta}</p> : null}
            {item.description ? (
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.description}</p>
            ) : null}
          </>
        );

        return (
          <li key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
