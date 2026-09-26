import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "accent" | "placeholder" | "bronze" | "pine";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-ink/5 text-ink-muted",
  accent: "bg-mint-soft text-pine dark:bg-mint dark:text-pine",
  pine: "bg-mint-soft text-pine dark:bg-mint dark:text-pine",
  placeholder: "bg-bronze/10 text-bronze",
  bronze: "bg-bronze/15 text-bronze",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
