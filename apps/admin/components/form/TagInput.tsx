"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { controlClassName } from "./Input";

type TagInputProps = {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
};

export function TagInput({
  id,
  value = [],
  onChange,
  placeholder = "برچسب را بنویسید و Enter بزنید",
  error = false,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const tags = value ?? [];

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.some((item) => item === tag)) {
      setDraft("");
      return;
    }
    onChange([...tags, tag]);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
      return;
    }
    if (e.key === "Backspace" && !draft && tags.length) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className={controlClassName(
        error,
        "flex min-h-[2.75rem] flex-wrap items-center gap-2 py-2",
      )}
      aria-invalid={error || undefined}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-pine/20 bg-mint-soft/60 px-2.5 py-1 text-xs font-medium text-pine"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((item) => item !== tag))}
            className="rounded-full p-0.5 text-pine/70 transition hover:bg-pine/10 hover:text-pine"
            aria-label={`حذف ${tag}`}
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (draft.trim()) addTag(draft);
        }}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-[10rem] flex-1 border-0 bg-transparent p-0 text-sm text-ink outline-none placeholder:text-ink-muted/70"
      />
    </div>
  );
}
