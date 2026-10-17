import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  Newspaper,
  Share2,
  Users,
  UsersRound,
} from "lucide-react";

export type HowMetValue =
  | "school"
  | "family"
  | "colleagues"
  | "books"
  | "media"
  | "social"
  | "other";

export type HowMetOption = {
  value: HowMetValue;
  label: string;
  icon: LucideIcon;
};

export const HOW_MET_OPTIONS: HowMetOption[] = [
  { value: "school", label: "مدرسه / دانش‌آموزی", icon: GraduationCap },
  { value: "family", label: "خانواده", icon: Users },
  { value: "colleagues", label: "همکاران و دوستان", icon: UsersRound },
  { value: "books", label: "کتاب و نوشته‌ها", icon: BookOpen },
  { value: "media", label: "رسانه", icon: Newspaper },
  { value: "social", label: "شبکه‌های اجتماعی", icon: Share2 },
  { value: "other", label: "سایر", icon: MoreHorizontal },
];

const HOW_MET_VALUES = new Set<string>(HOW_MET_OPTIONS.map((o) => o.value));

/** Accept stored keys or legacy free-text; unknown text maps to other. */
export function normalizeHowMetValue(raw: string | null | undefined): HowMetValue | "" {
  const value = (raw || "").trim();
  if (!value) return "";
  if (HOW_MET_VALUES.has(value)) return value as HowMetValue;
  return "other";
}
