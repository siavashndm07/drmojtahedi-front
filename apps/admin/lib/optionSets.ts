import {
  BookOpen,
  Building2,
  Clock3,
  FileText,
  GraduationCap,
  HandHeart,
  Image as ImageIcon,
  LayoutGrid,
  Mic,
  Package,
  PencilLine,
  Rocket,
  Users,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { OptionPill } from "@/components/OptionPills";

export const PUBLISH_STATUS_OPTIONS: OptionPill[] = [
  { value: "published", label: "منتشر", icon: Rocket, hint: "نمایش در سایت" },
  { value: "draft", label: "پیش‌نویس", icon: PencilLine, hint: "فقط در پنل" },
  { value: "coming-soon", label: "به‌زودی", icon: Clock3, hint: "اعلام آینده" },
];

export const PERSON_KIND_OPTIONS: OptionPill[] = [
  { value: "student", label: "شاگرد", icon: GraduationCap },
  { value: "colleague", label: "همکار", icon: Users },
  { value: "founder", label: "مؤسس", icon: Building2 },
  { value: "family", label: "خانواده", icon: UserRound },
  { value: "organ", label: "ارکان", icon: HandHeart },
  { value: "other", label: "سایر", icon: LayoutGrid },
];

export const ARCHIVE_TYPE_OPTIONS: OptionPill[] = [
  { value: "document", label: "سند", icon: FileText },
  { value: "photo", label: "عکس", icon: ImageIcon },
  { value: "audio", label: "صوت", icon: Mic },
  { value: "video", label: "ویدئو", icon: Video },
  { value: "book", label: "کتاب", icon: BookOpen },
  { value: "object", label: "شیء", icon: Package },
];

export const SPONSOR_KIND_OPTIONS: OptionPill[] = [
  { value: "individual", label: "فردی", icon: UserRound, hint: "شخص حقیقی" },
  {
    value: "organization",
    label: "سازمانی",
    icon: Building2,
    hint: "شرکت یا نهاد",
  },
];

export const STATUS_FILTER_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  published: Rocket,
  draft: PencilLine,
  "coming-soon": Clock3,
  new: Rocket,
  reviewed: HandHeart,
  archived: Package,
};
