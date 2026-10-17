"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  CornerDownLeft,
} from "lucide-react";
import { sanitizeSimpleHtml } from "@drmojtahedi/shared";

type SimpleHtmlEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
};

function normalizeEditorHtml(raw: string): string {
  const withSemantics = raw
    .replace(/<\/?b\b[^>]*>/gi, (m) => (m.startsWith("</") ? "</strong>" : "<strong>"))
    .replace(/<\/?i\b[^>]*>/gi, (m) => (m.startsWith("</") ? "</em>" : "<em>"))
    .replace(/<\/?div\b[^>]*>/gi, (m) => (m.startsWith("</") ? "</p>" : "<p>"))
    .replace(/<br\s*\/?>/gi, "<br />");
  return sanitizeSimpleHtml(withSemantics);
}

function ToolbarButton({
  label,
  onMouseDown,
  children,
}: {
  label: string;
  onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={onMouseDown}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-ink-muted transition hover:border-ink/10 hover:bg-cream hover:text-ink"
    >
      {children}
    </button>
  );
}

export default function SimpleHtmlEditor({
  id,
  value,
  onChange,
  placeholder = "متن پیام…",
  rows = 8,
}: SimpleHtmlEditorProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef(normalizeEditorHtml(value));
  const readyRef = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = normalizeEditorHtml(value);
    if (!readyRef.current) {
      el.innerHTML = next || "";
      lastEmitted.current = next;
      readyRef.current = true;
      return;
    }
    if (next === lastEmitted.current) return;
    if (el.innerHTML === next) return;
    el.innerHTML = next || "";
    lastEmitted.current = next;
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = normalizeEditorHtml(el.innerHTML);
    if (html === lastEmitted.current) return;
    lastEmitted.current = html;
    onChange(html);
  }, [onChange]);

  const run = useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, commandValue);
      emit();
    },
    [emit],
  );

  const wrapWith = useCallback(
    (tag: "strong" | "em" | "p") => {
      editorRef.current?.focus();
      const selected = window.getSelection()?.toString() ?? "";
      const content = selected || (tag === "p" ? "پاراگراف" : "متن");
      document.execCommand(
        "insertHTML",
        false,
        `<${tag}>${content}</${tag}>`,
      );
      emit();
    },
    [emit],
  );

  const insertLink = useCallback(() => {
    editorRef.current?.focus();
    const selected = window.getSelection()?.toString() ?? "";
    const href = window.prompt("آدرس لینک", "https://");
    if (!href?.trim()) return;
    const label = selected || href.trim();
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${href.trim()}">${label}</a>`,
    );
    emit();
  }, [emit]);

  const minHeight = `${Math.max(rows, 4) * 1.6}rem`;

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface focus-within:border-pine/40 focus-within:ring-2 focus-within:ring-pine/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ink/10 bg-cream/40 px-1.5 py-1">
        <ToolbarButton label="پررنگ" onMouseDown={(e) => { e.preventDefault(); wrapWith("strong"); }}>
          <Bold className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton label="ایتالیک" onMouseDown={(e) => { e.preventDefault(); wrapWith("em"); }}>
          <Italic className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton label="پاراگراف" onMouseDown={(e) => { e.preventDefault(); wrapWith("p"); }}>
          <Pilcrow className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="فهرست نقطه‌ای"
          onMouseDown={(e) => {
            e.preventDefault();
            run("insertUnorderedList");
          }}
        >
          <List className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="فهرست شماره‌دار"
          onMouseDown={(e) => {
            e.preventDefault();
            run("insertOrderedList");
          }}
        >
          <ListOrdered className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="لینک"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
        >
          <Link2 className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="خط جدید"
          onMouseDown={(e) => {
            e.preventDefault();
            run("insertHTML", "<br />");
          }}
        >
          <CornerDownLeft className="h-3.5 w-3.5" aria-hidden />
        </ToolbarButton>
      </div>
      <div
        id={fieldId}
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        dir="rtl"
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className="min-h-[8rem] px-3 py-2.5 text-sm leading-7 text-ink outline-none empty:before:pointer-events-none empty:before:text-ink-muted empty:before:content-[attr(data-placeholder)] [&_a]:font-medium [&_a]:text-pine [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:my-2 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ps-5"
        style={{ minHeight }}
      />
    </div>
  );
}
