"use client";

import { useRef } from "react";
import {
  AlignRight,
  ArrowDown,
  ArrowUp,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Quote,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import ImageAssetField from "@/components/ImageAssetField";
import { Field } from "./Field";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import {
  NEWS_BLOCK_TYPE_LABELS,
  NEWS_BLOCK_TYPES,
  emptyNewsBlock,
  type NewsBodyBlock,
  type NewsBlockType,
} from "@/lib/newsBlocks";

const BLOCK_ICONS: Record<NewsBlockType, LucideIcon> = {
  paragraph: AlignRight,
  h2: Heading2,
  h3: Heading3,
  tip: Lightbulb,
  ul: List,
  ol: ListOrdered,
  quote: Quote,
  image: ImageIcon,
};

const ADDABLE_TYPES: NewsBlockType[] = [
  "paragraph",
  "h2",
  "h3",
  "tip",
  "ul",
  "ol",
  "quote",
  "image",
];

function placeholderFor(type: NewsBlockType): string {
  switch (type) {
    case "h2":
      return "عنوان اصلی بخش…";
    case "h3":
      return "زیرعنوان…";
    case "tip":
      return "متن نکته…";
    case "ul":
      return "هر خط یک مورد فهرست";
    case "ol":
      return "هر خط یک مورد شماره‌دار";
    case "quote":
      return "متن نقل‌قول…";
    default:
      return "متن پاراگراف…";
  }
}

function rowsFor(type: NewsBlockType): number {
  if (type === "h2" || type === "h3") return 2;
  if (type === "ul" || type === "ol") return 4;
  return 3;
}

function insertMarkdownLink(
  text: string,
  start: number,
  end: number,
): { next: string; selectStart: number; selectEnd: number } {
  const selected = text.slice(start, end).trim() || "متن لینک";
  const prefix = text.slice(0, start);
  const suffix = text.slice(end);
  const open = `[${selected}](`;
  const url = "https://";
  return {
    next: `${prefix}${open}${url})${suffix}`,
    selectStart: prefix.length + open.length,
    selectEnd: prefix.length + open.length + url.length,
  };
}

export default function NewsBodyEditor({
  label = "بدنه خبر",
  blocks,
  onChange,
}: {
  label?: string;
  blocks: NewsBodyBlock[];
  onChange: (blocks: NewsBodyBlock[]) => void;
}) {
  const items = blocks.length > 0 ? blocks : [emptyNewsBlock()];
  const textareas = useRef<Array<HTMLTextAreaElement | null>>([]);
  const keysRef = useRef<string[]>([]);

  function syncKeys(count: number) {
    const keys = keysRef.current;
    while (keys.length < count) {
      keys.push(
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `block-${keys.length}-${Date.now()}`,
      );
    }
    if (keys.length > count) keys.splice(count);
    return keys;
  }

  syncKeys(items.length);

  function update(index: number, patch: Partial<NewsBodyBlock>) {
    onChange(items.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  }

  function changeType(index: number, type: NewsBlockType) {
    const block = items[index];
    if (!block) return;
    if (type === "image") {
      update(index, { type, src: block.src ?? "", alt: block.alt ?? block.text ?? "" });
      return;
    }
    update(index, { type, src: "", alt: "" });
  }

  function remove(index: number) {
    keysRef.current = keysRef.current.filter((_, i) => i !== index);
    const next = items.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [emptyNewsBlock()]);
  }

  function add(type: NewsBlockType = "paragraph") {
    keysRef.current = [
      ...syncKeys(items.length),
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `block-${items.length}-${Date.now()}`,
    ];
    onChange([...items, emptyNewsBlock(type)]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const nextKeys = [...keysRef.current];
    const [k] = nextKeys.splice(index, 1);
    nextKeys.splice(target, 0, k);
    keysRef.current = nextKeys;
    const next = [...items];
    const [b] = next.splice(index, 1);
    next.splice(target, 0, b);
    onChange(next);
  }

  function addLink(index: number) {
    const node = textareas.current[index];
    const block = items[index];
    if (!block || block.type === "image") return;
    const start = node?.selectionStart ?? block.text.length;
    const end = node?.selectionEnd ?? block.text.length;
    const { next, selectStart, selectEnd } = insertMarkdownLink(block.text, start, end);
    update(index, { text: next });
    requestAnimationFrame(() => {
      const field = textareas.current[index];
      if (!field) return;
      field.focus();
      field.setSelectionRange(selectStart, selectEnd);
    });
  }

  return (
    <Field
      label={label}
      hint="بلوک‌ها مثل مقالات بینا: پاراگراف، عنوان، فهرست، نقل‌قول و تصویر با آدرس URL. لینک درون‌متنی: [متن](https://…)"
    >
      <div className="space-y-3">
        {items.map((block, index) => {
          const TypeIcon = BLOCK_ICONS[block.type];
          return (
            <div
              key={keysRef.current[index] ?? index}
              className="rounded-2xl border border-ink/10 bg-cream/40 p-3 dark:bg-cream/20"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-surface text-pine">
                  <TypeIcon className="h-4 w-4" aria-hidden />
                </span>
                <Select
                  value={block.type}
                  onChange={(e) => changeType(index, e.target.value as NewsBlockType)}
                  aria-label={`نوع بلوک ${index + 1}`}
                  className="max-w-[11rem] !py-2 text-xs"
                >
                  {NEWS_BLOCK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {NEWS_BLOCK_TYPE_LABELS[type]}
                    </option>
                  ))}
                </Select>
                {block.type !== "image" ? (
                  <button
                    type="button"
                    onClick={() => addLink(index)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink/10 px-2.5 text-xs font-medium text-pine transition hover:border-pine/30 hover:bg-mint-soft/40"
                    title="درج لینک"
                  >
                    <Link2 className="h-3.5 w-3.5" aria-hidden />
                    لینک
                  </button>
                ) : null}
                <div className="ms-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-muted transition hover:border-pine/30 hover:text-pine disabled:opacity-30"
                    aria-label="جابه‌جایی به بالا"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-muted transition hover:border-pine/30 hover:text-pine disabled:opacity-30"
                    aria-label="جابه‌جایی به پایین"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label="حذف بلوک"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>

              {block.type === "image" ? (
                <div className="space-y-3">
                  <ImageAssetField
                    label="تصویر بلوک"
                    kind="news"
                    imageId={null}
                    imageUrl={block.src ?? ""}
                    aspectClass="aspect-[16/9]"
                    removeDescription="این تصویر از بلوک بدنه حذف می‌شود."
                    onChange={({ url }) => update(index, { src: url })}
                  />
                  <Field label="متن جایگزین / شرح" htmlFor={`news-img-alt-${index}`}>
                    <Input
                      id={`news-img-alt-${index}`}
                      value={block.text}
                      onChange={(e) =>
                        update(index, { text: e.target.value, alt: e.target.value })
                      }
                      placeholder="شرح تصویر"
                    />
                  </Field>
                </div>
              ) : (
                <Textarea
                  ref={(el) => {
                    textareas.current[index] = el;
                  }}
                  rows={rowsFor(block.type)}
                  value={block.text}
                  onChange={(e) => update(index, { text: e.target.value })}
                  placeholder={placeholderFor(block.type)}
                  aria-label={`${NEWS_BLOCK_TYPE_LABELS[block.type]} ${index + 1}`}
                  className="min-h-[4rem]"
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap gap-2">
          {ADDABLE_TYPES.map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => add(type)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-ink/15 px-3 py-2 text-xs font-medium text-pine transition hover:border-pine/30 hover:bg-mint-soft/40"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {NEWS_BLOCK_TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>
    </Field>
  );
}
