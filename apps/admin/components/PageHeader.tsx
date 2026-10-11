import type { ReactNode } from "react";

function isLoadingDescription(description?: string) {
  if (!description) return false;
  return (
    description === "در حال بارگذاری…" ||
    description.startsWith("در حال بارگذاری")
  );
}

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const loading = isLoadingDescription(description);

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {loading ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted" role="status">
            <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-pine/25 border-t-pine" />
            <span>در حال آماده‌سازی…</span>
          </div>
        ) : description ? (
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
