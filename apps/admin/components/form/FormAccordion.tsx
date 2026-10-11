"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

type AccordionContextValue = {
  openIds: Set<string>;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function FormAccordion({
  children,
  defaultOpenIds = [],
  storageKey,
  variant = "default",
}: {
  children: ReactNode;
  defaultOpenIds?: string[];
  storageKey?: string;
  /** Nested panels inside another accordion — denser spacing. */
  variant?: "default" | "nested";
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpenIds(new Set(parsed));
        }
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify([...next]));
          } catch {
            /* ignore */
          }
        }
        return next;
      });
    },
    [storageKey],
  );

  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      <div className={variant === "nested" ? "space-y-2" : "space-y-3"}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function FormAccordionItem({
  id,
  title,
  description,
  icon: Icon,
  children,
  variant = "default",
}: {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: "default" | "nested";
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("FormAccordionItem must be used inside FormAccordion");
  }

  const open = ctx.openIds.has(id);
  const nested = variant === "nested";

  return (
    <section
      className={`overflow-hidden border border-ink/10 ${
        nested
          ? "rounded-xl bg-cream/20 dark:bg-surface/30"
          : "rounded-2xl bg-surface"
      }`}
    >
      <button
        type="button"
        id={`accordion-${id}`}
        aria-expanded={open}
        aria-controls={`accordion-panel-${id}`}
        onClick={() => ctx.toggle(id)}
        className={`flex w-full items-start justify-between gap-3 text-start transition hover:bg-mint-soft/40 dark:hover:bg-mint/20 ${
          nested ? "px-3.5 py-3" : "p-5"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {Icon ? (
            <span
              className={`mt-0.5 flex shrink-0 items-center justify-center rounded-xl bg-mint-soft/80 text-mint-deep dark:bg-mint/40 ${
                nested ? "h-8 w-8" : "h-9 w-9"
              }`}
            >
              <Icon className={nested ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2
              className={`font-semibold text-ink ${
                nested ? "text-sm" : "text-base"
              }`}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={`mt-0.5 text-ink-muted ${
                  nested ? "text-xs leading-5" : "mt-1 text-sm leading-6"
                }`}
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <ChevronDown
          className={`mt-0.5 shrink-0 text-ink-muted transition-transform duration-200 ${
            nested ? "h-4 w-4" : "h-5 w-5"
          } ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`space-y-4 border-t border-ink/10 ${
              nested ? "space-y-3 p-3.5 pt-3" : "p-5 pt-4"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
