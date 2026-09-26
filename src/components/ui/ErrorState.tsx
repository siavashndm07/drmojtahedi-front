import { cn } from "@/lib/utils/cn";

export function ErrorState({
  title = "خطایی رخ داد",
  description = "لطفاً دوباره تلاش کنید.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl border border-ink/10 bg-surface px-6 py-10 shadow-sm",
        className,
      )}
    >
      <h3 className="text-lg font-medium text-ink">{title}</h3>
      <p className="max-w-xl text-ink-muted">{description}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-primary">
          تلاش مجدد
        </button>
      ) : null}
    </div>
  );
}
