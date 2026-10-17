"use client";

import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import {
  DEFAULT_HOME_SECTION_ORDER,
  HOME_SECTION_LABELS,
  normalizeHomeSectionOrder,
  type HomeSectionKey,
  type HomeSections,
} from "@drmojtahedi/shared";
import ActionIconButton from "@/components/ActionIconButton";
import SortableHandle from "@/components/SortableHandle";
import { Checkbox } from "@/components/form";
import { arrayMove, useListReorder } from "@/lib/reorder";

type HomeSectionOrderEditorProps = {
  order: HomeSectionKey[];
  enabled: HomeSections;
  onOrderChange: (next: HomeSectionKey[]) => void;
  onEnabledChange: (key: HomeSectionKey, active: boolean) => void;
  onResetOrder?: () => void;
};

export default function HomeSectionOrderEditor({
  order,
  enabled,
  onOrderChange,
  onEnabledChange,
  onResetOrder,
}: HomeSectionOrderEditorProps) {
  const normalized = normalizeHomeSectionOrder(order);
  const reorder = useListReorder({
    onMove: (from, to) => onOrderChange(arrayMove(normalized, from, to)),
  });

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= normalized.length) return;
    onOrderChange(arrayMove(normalized, index, target));
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream/20 p-4 dark:bg-mint/10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">ترتیب نمایش بخش‌ها</p>
          <p className="mt-1 text-xs leading-6 text-ink-muted">
            بخش را بکشید یا با دکمه‌ها جابه‌جا کنید. تیک، نمایش در صفحه اصلی را
            روشن یا خاموش می‌کند.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onResetOrder
              ? onResetOrder()
              : onOrderChange([...DEFAULT_HOME_SECTION_ORDER])
          }
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/10 bg-surface px-3 py-2 text-xs font-medium text-ink-muted transition hover:border-pine/30 hover:text-pine"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          بازنشانی ترتیب پیش‌فرض
        </button>
      </div>

      <ul className="space-y-2">
        {normalized.map((key, index) => {
          const active = enabled[key] !== false;
          return (
            <li
              key={key}
              {...reorder.itemProps(index)}
              className={reorder.itemClassName(
                index,
                `flex items-center gap-2 rounded-xl border px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${
                  active
                    ? "border-ink/10 bg-surface"
                    : "border-dashed border-ink/10 bg-surface/60"
                }`,
              )}
            >
              <SortableHandle label={`جابه‌جایی ${HOME_SECTION_LABELS[key]}`} />
              <Checkbox
                id={`home-section-${key}`}
                checked={active}
                onChange={(e) => onEnabledChange(key, e.target.checked)}
                aria-label={HOME_SECTION_LABELS[key]}
                className="shrink-0"
              />
              <p
                className={`min-w-0 flex-1 text-sm font-medium ${
                  active ? "text-ink" : "text-ink-muted"
                }`}
              >
                {HOME_SECTION_LABELS[key]}
              </p>
              <div className="flex shrink-0 gap-1">
                <ActionIconButton
                  label="بالاتر"
                  variant="muted"
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </ActionIconButton>
                <ActionIconButton
                  label="پایین‌تر"
                  variant="muted"
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </ActionIconButton>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
