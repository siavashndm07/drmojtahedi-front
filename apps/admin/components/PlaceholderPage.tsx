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
      <div className="rounded-2xl border border-dashed border-ink/15 bg-mint-soft/40 px-5 py-8 text-center text-sm text-ink-muted dark:bg-mint/30">
        این بخش هنوز فرم و دادهٔ کامل ندارد — فقط برای هم‌ترازی منو و گفتگو است.
      </div>
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
