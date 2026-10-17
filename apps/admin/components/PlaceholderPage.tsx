import { Construction } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";

export default function PlaceholderPage({
  title,
  description,
  notes = [],
}: {
  title: string;
  description?: string;
  notes?: string[];
}) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description ?? "این مسیر برای هم‌ترازی منو با پنل بینا آماده است."}
      />
      <EmptyState
        icon={Construction}
        title="این بخش هنوز آماده نیست"
        description="فرم و دادهٔ این مسیر در حال تکمیل است. منو برای پیدا کردن جای آن از قبل اینجاست."
      />
      {notes.length ? (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">برای گفتگو</h2>
          <ul className="mt-3 list-disc space-y-2 pe-5 text-sm leading-7 text-ink-muted">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
