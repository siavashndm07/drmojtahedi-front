import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardPadding = "none" | "sm" | "md" | "lg";

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
  hover?: boolean;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <Tag
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm dark:bg-surface",
        hover &&
          "transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card",
        paddings[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardLink({
  href,
  title,
  description,
  eyebrow,
  meta,
  className,
  media,
}: {
  href: string;
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: string;
  className?: string;
  media?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card",
        className,
      )}
    >
      {media ? <div className="relative overflow-hidden">{media}</div> : null}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.16em] text-mint-deep">{eyebrow}</p>
        ) : null}
        <h3 className="mt-2 text-lg font-semibold text-ink group-hover:text-pine">{title}</h3>
        {description ? (
          <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{description}</p>
        ) : null}
        {meta ? <p className="mt-3 text-xs text-ink-muted">{meta}</p> : null}
      </div>
    </Link>
  );
}
