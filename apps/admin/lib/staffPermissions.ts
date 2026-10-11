export type StaffPermissionKey =
  | "dashboard"
  | "content"
  | "heritage"
  | "archive"
  | "foundation"
  | "engagement"
  | "settings";

export const STAFF_PERMISSION_KEYS: StaffPermissionKey[] = [
  "dashboard",
  "content",
  "heritage",
  "archive",
  "foundation",
  "engagement",
  "settings",
];

export const STAFF_PERMISSION_LABELS: Record<StaffPermissionKey, string> = {
  dashboard: "داشبورد",
  content: "محتوا (اخبار، مقالات، کتاب)",
  heritage: "میراث (افراد، مکان، خط زمان)",
  archive: "آرشیو و تاریخ شفاهی",
  foundation: "بنیاد (پروژه، حامی، ارکان)",
  engagement: "همراهی (کمک، عضو، خبرنامه)",
  settings: "تنظیمات و کاربران پنل",
};

export function permissionForPath(path: string): StaffPermissionKey | null {
  const p = path.split("?")[0].replace(/\/$/, "") || "/";
  if (p === "/login" || p.startsWith("/account")) return null;
  if (p === "/" || p === "") return "dashboard";
  if (p.startsWith("/news") || p.startsWith("/articles") || p.startsWith("/books")) {
    return "content";
  }
  if (p.startsWith("/people") || p.startsWith("/places") || p.startsWith("/timeline")) {
    return "heritage";
  }
  if (p.startsWith("/archive") || p.startsWith("/oral-history") || p.startsWith("/media")) {
    return "archive";
  }
  if (p.startsWith("/projects") || p.startsWith("/sponsors") || p.startsWith("/organs")) {
    return "foundation";
  }
  if (
    p.startsWith("/donations") ||
    p.startsWith("/members") ||
    p.startsWith("/newsletter") ||
    p.startsWith("/contributions")
  ) {
    return "engagement";
  }
  if (p.startsWith("/settings") || p.startsWith("/ai")) return "settings";
  return "dashboard";
}

export function firstAllowedPath(permissions: string[], isSuperuser: boolean): string {
  if (isSuperuser || permissions.includes("dashboard")) return "/";
  if (permissions.includes("content")) return "/news";
  if (permissions.includes("heritage")) return "/people";
  if (permissions.includes("archive")) return "/archive";
  if (permissions.includes("foundation")) return "/projects";
  if (permissions.includes("engagement")) return "/donations";
  if (permissions.includes("settings")) return "/settings";
  return "/login";
}
