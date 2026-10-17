import { useRef, useState, type DragEvent } from "react";

export function arrayMove<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type UseListReorderOptions = {
  enabled?: boolean;
  onMove: (from: number, to: number) => void;
};

export function useListReorder({ enabled = true, onMove }: UseListReorderOptions) {
  const dragIndex = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function isInteractiveStart(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        "a, input, textarea, select, label, button:not([data-drag-handle])",
      ),
    );
  }

  function itemProps(index: number) {
    return {
      draggable: enabled,
      onDragStart: (event: DragEvent<HTMLElement>) => {
        if (!enabled || isInteractiveStart(event.target)) {
          event.preventDefault();
          return;
        }
        dragIndex.current = index;
        setActiveIndex(index);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
      },
      onDragOver: (event: DragEvent<HTMLElement>) => {
        if (!enabled || dragIndex.current === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (overIndex !== index) setOverIndex(index);
      },
      onDrop: (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        const from = dragIndex.current;
        dragIndex.current = null;
        setActiveIndex(null);
        setOverIndex(null);
        if (!enabled || from === null || from === index) return;
        onMove(from, index);
      },
      onDragEnd: () => {
        dragIndex.current = null;
        setActiveIndex(null);
        setOverIndex(null);
      },
    };
  }

  function itemClassName(index: number, extra = "") {
    const parts = [extra];
    if (enabled) parts.push("cursor-grab active:cursor-grabbing");
    if (activeIndex === index) parts.push("opacity-60");
    if (overIndex === index && activeIndex !== index) {
      parts.push("ring-2 ring-pine/40");
    }
    return parts.filter(Boolean).join(" ");
  }

  return { activeIndex, overIndex, itemProps, itemClassName };
}
