import { PageHeader } from "@/components/PageHeader";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-2xl border border-dashed border-ink/15 bg-surface p-8 text-sm leading-8 text-ink-muted">
        این بخش به‌زودی با فرم‌های مدیریت کامل می‌شود. فعلاً مسیر در ناوبری
        آماده است.
      </div>
    </div>
  );
}
