import type { Article, ArticleBodyBlock } from "@/lib/types";

export function articleBlocks(article: Article): ArticleBodyBlock[] {
  if (article.blocks?.length) return article.blocks;
  if (article.body?.trim()) {
    return [{ type: "paragraph", text: article.body.trim() }];
  }
  if (article.description?.trim()) {
    return [{ type: "paragraph", text: article.description.trim() }];
  }
  return [];
}

export function articleBlockNavLabel(
  block: ArticleBodyBlock,
  index: number,
  sectionLabel: (index: number) => string,
): string {
  if (block.type === "h2" || block.type === "h3") {
    return block.text.trim() || sectionLabel(index);
  }
  if (block.type === "tip") return "نکته";
  if (block.type === "quote") return "نقل‌قول";
  if (index === 0) return "آغاز مطلب";
  return sectionLabel(index);
}

/** Lightweight inline links: [label](/path) or [label](https://…) */
export function parseArticleInline(text: string) {
  const parts: Array<
    | { kind: "text"; value: string }
    | { kind: "link"; label: string; href: string }
  > = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      parts.push({ kind: "text", value: text.slice(last, match.index) });
    }
    parts.push({ kind: "link", label: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ kind: "text", value: text.slice(last) });
  }
  if (!parts.length) parts.push({ kind: "text", value: text });
  return parts;
}

export function listItemsFromBlock(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}
