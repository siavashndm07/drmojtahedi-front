"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-10 items-center justify-center rounded-full text-pine transition hover:bg-mint-soft dark:hover:bg-mint"
      aria-label={isDark ? "حالت روشن" : "حالت تاریک"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
    >
      {isDark ? <Sun className="size-5" strokeWidth={1.9} /> : <Moon className="size-5" strokeWidth={1.9} />}
    </button>
  );
}
