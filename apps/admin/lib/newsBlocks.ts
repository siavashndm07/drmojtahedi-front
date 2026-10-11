export type NewsBlockType =
  | "paragraph"
  | "h2"
  | "h3"
  | "tip"
  | "ul"
  | "ol"
  | "quote"
  | "image";

export type NewsBodyBlock = {
  type: NewsBlockType;
  text: string;
  src?: string;
  alt?: string;
};

export const NEWS_BLOCK_TYPES: NewsBlockType[] = [
  "paragraph",
  "h2",
  "h3",
  "tip",
  "ul",
  "ol",
  "quote",
  "image",
];

export const NEWS_BLOCK_TYPE_LABELS: Record<NewsBlockType, string> = {
  paragraph: "پاراگراف",
  h2: "عنوان H2",
  h3: "عنوان H3",
  tip: "نکته",
  ul: "فهرست",
  ol: "فهرست شماره‌دار",
  quote: "نقل‌قول",
  image: "تصویر",
};

export function emptyNewsBlock(type: NewsBlockType = "paragraph"): NewsBodyBlock {
  if (type === "image") {
    return { type: "image", text: "", src: "", alt: "" };
  }
  return { type, text: "" };
}

export function normalizeNewsBlocks(input: unknown): NewsBodyBlock[] {
  if (Array.isArray(input)) {
    return input
      .map((raw) => {
        if (!raw || typeof raw !== "object") return null;
        const row = raw as Record<string, unknown>;
        const type = String(row.type || "paragraph") as NewsBlockType;
        if (!NEWS_BLOCK_TYPES.includes(type)) return null;
        return {
          type,
          text: String(row.text ?? ""),
          src: row.src ? String(row.src) : "",
          alt: row.alt ? String(row.alt) : String(row.text ?? ""),
        } satisfies NewsBodyBlock;
      })
      .filter(Boolean) as NewsBodyBlock[];
  }
  if (typeof input === "string" && input.trim()) {
    return [{ type: "paragraph", text: input.trim() }];
  }
  return [];
}

export function blocksToPlainBody(blocks: NewsBodyBlock[]): string {
  return blocks
    .filter((b) => b.type !== "image")
    .map((b) => b.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function slugifyFa(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\s]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06ff-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
