import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="content-shell section-pad space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-2/3 max-w-xl" />
      <Skeleton className="h-24 w-full max-w-3xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
