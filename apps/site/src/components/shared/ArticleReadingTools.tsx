"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import {
  Check,
  FileDown,
  Link2,
  Minus,
  Plus,
  Printer,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ZOOM_MIN = 90;
const ZOOM_MAX = 140;
const ZOOM_STEP = 10;

type ReadingToolsContextValue = {
  zoom: number;
  setZoom: (value: number | ((prev: number) => number)) => void;
};

const ReadingToolsContext = createContext<ReadingToolsContextValue | null>(null);

export function ArticleReadingScope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [zoom, setZoom] = useState(100);
  const value = useMemo(() => ({ zoom, setZoom }), [zoom]);

  return (
    <ReadingToolsContext.Provider value={value}>
      <div className={className}>{children}</div>
    </ReadingToolsContext.Provider>
  );
}

/** Scales rem-based Tailwind text; wrap the article body with this. */
export function ArticleZoomable({
  children,
  className,
  id = "article-content",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ctx = useContext(ReadingToolsContext);
  const zoom = ctx?.zoom ?? 100;

  return (
    <div
      id={id}
      className={cn("origin-top transition-[zoom]", className)}
      style={{ zoom: zoom / 100 }}
    >
      {children}
    </div>
  );
}

type ArticleReadingToolsProps = {
  title: string;
  description?: string;
  className?: string;
};

export function ArticleReadingTools({
  title,
  description,
  className,
}: ArticleReadingToolsProps) {
  const labelId = useId();
  const ctx = useContext(ReadingToolsContext);
  const zoom = ctx?.zoom ?? 100;
  const setZoom = ctx?.setZoom;
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl || window.location.href);
      setCopied(true);
      toast.success("پیوند کپی شد");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("کپی پیوند ممکن نشد");
    }
  }, [pageUrl]);

  const shareNative = useCallback(async () => {
    const url = pageUrl || window.location.href;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    setShareOpen((open) => !open);
  }, [description, pageUrl, title]);

  function printPage() {
    window.print();
  }

  function savePdf() {
    toast("در پنجرهٔ چاپ، چاپگر را روی «ذخیره به‌صورت PDF» بگذارید", {
      duration: 4200,
    });
    window.setTimeout(() => window.print(), 350);
  }

  const encodedUrl = encodeURIComponent(pageUrl || "");
  const encodedTitle = encodeURIComponent(title);

  return (
    <div
      className={cn(
        "print:hidden flex flex-wrap items-center gap-1.5 rounded-2xl border border-ink/10 bg-surface p-1.5 shadow-sm",
        className,
      )}
      role="toolbar"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        ابزارهای مطالعه
      </span>

      <div className="relative">
        <ToolButton
          label="اشتراک‌گذاری"
          onClick={() => void shareNative()}
          active={shareOpen}
        >
          <Share2 className="size-4" aria-hidden />
        </ToolButton>
        {shareOpen ? (
          <div className="absolute start-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-lg">
            <ShareLink
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
              label="تلگرام"
              onPick={() => setShareOpen(false)}
            />
            <ShareLink
              href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
              label="واتساپ"
              onPick={() => setShareOpen(false)}
            />
            <ShareLink
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              label="توییتر / X"
              onPick={() => setShareOpen(false)}
            />
            <button
              type="button"
              onClick={() => {
                void copyLink();
                setShareOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-xs text-ink hover:bg-mint-soft/60"
            >
              {copied ? (
                <Check className="size-3.5 text-pine" aria-hidden />
              ) : (
                <Link2 className="size-3.5 text-pine" aria-hidden />
              )}
              کپی پیوند
            </button>
          </div>
        ) : null}
      </div>

      <ToolButton label="چاپ" onClick={printPage}>
        <Printer className="size-4" aria-hidden />
      </ToolButton>

      <ToolButton label="ذخیره PDF" onClick={savePdf}>
        <FileDown className="size-4" aria-hidden />
      </ToolButton>

      <span className="mx-1 hidden h-6 w-px bg-ink/10 sm:block" aria-hidden />

      <ToolButton
        label="کوچک‌تر کردن متن"
        onClick={() =>
          setZoom?.((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
        }
        disabled={!setZoom || zoom <= ZOOM_MIN}
      >
        <Minus className="size-4" aria-hidden />
      </ToolButton>
      <span
        className="min-w-10 text-center text-xs font-medium tabular-nums text-ink-muted"
        dir="ltr"
      >
        {zoom}%
      </span>
      <ToolButton
        label="بزرگ‌تر کردن متن"
        onClick={() =>
          setZoom?.((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
        }
        disabled={!setZoom || zoom >= ZOOM_MAX}
      >
        <Plus className="size-4" aria-hidden />
      </ToolButton>
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  children,
  disabled,
  active,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition hover:bg-mint-soft/70 hover:text-pine disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-mint-soft text-pine",
      )}
    >
      {children}
    </button>
  );
}

function ShareLink({
  href,
  label,
  onPick,
}: {
  href: string;
  label: string;
  onPick: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onPick}
      className="block px-3 py-2.5 text-xs text-ink hover:bg-mint-soft/60"
    >
      {label}
    </a>
  );
}
