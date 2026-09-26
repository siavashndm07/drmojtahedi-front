import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function IconBadge({
  icon: Icon,
  className,
  iconClassName,
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "size-8 rounded-lg",
    md: "size-10 rounded-xl",
    lg: "size-12 rounded-2xl",
  };
  const iconSizes = {
    sm: "size-3.5",
    md: "size-4.5",
    lg: "size-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-mint-soft text-pine dark:bg-mint",
        sizes[size],
        className,
      )}
    >
      <Icon className={cn(iconSizes[size], iconClassName)} strokeWidth={1.8} aria-hidden />
    </span>
  );
}
