import { GripVertical } from "lucide-react";

type SortableHandleProps = {
  label?: string;
  disabled?: boolean;
};

export default function SortableHandle({
  label = "جابه‌جایی با کشیدن",
  disabled = false,
}: SortableHandleProps) {
  return (
    <span
      data-drag-handle
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink-muted ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-grab hover:bg-cream hover:text-ink active:cursor-grabbing"
      }`}
    >
      <GripVertical className="h-4 w-4" aria-hidden />
    </span>
  );
}
