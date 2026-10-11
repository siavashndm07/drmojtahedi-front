"use client";

import { LayoutDashboard } from "lucide-react";

export default function AdminLoadingScreen({
  message = "در حال آماده‌سازی پنل…",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-pine/10" />
        <span className="absolute inset-1 animate-spin rounded-xl border-2 border-transparent border-t-pine border-r-pine/40" />
        <LayoutDashboard className="relative h-6 w-6 text-pine" aria-hidden />
      </div>
      <p className="text-xs text-ink-muted" role="status">
        {message}
      </p>
      <div className="h-1 w-36 overflow-hidden rounded-full bg-ink/5">
        <div className="admin-loading-bar h-full w-1/2 rounded-full bg-pine" />
      </div>
    </div>
  );
}
