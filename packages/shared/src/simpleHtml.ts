/** Tags allowed in admin-authored short HTML (donate message, etc.). */
export const SIMPLE_HTML_TAGS = [
  "p",
  "strong",
  "em",
  "li",
  "ul",
  "ol",
  "a",
  "br",
] as const;

const ALLOWED = new Set<string>(["p", "strong", "em", "li", "ul", "ol", "br"]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith("/")) return true;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return true;
  return false;
}

function extractHref(attrs: string): string {
  const hrefMatch = String(attrs || "").match(
    /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
  );
  return (hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "").trim();
}

/**
 * Strip everything except a small allowlist of tags.
 * Attributes are removed except a safe `href` on `<a>`.
 */
export function sanitizeSimpleHtml(input: string): string {
  if (!input) return "";
  let html = String(input);

  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  html = html.replace(
    /<\/?(iframe|object|embed|link|meta|form|input|button|svg|math|textarea|select)[^>]*>/gi,
    "",
  );

  const keptAnchors: string[] = [];
  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_m, attrs, inner) => {
    const href = extractHref(attrs);
    if (!isSafeHref(href)) return String(inner);
    const safe = escapeAttr(href);
    const external = /^(https?:)/i.test(href);
    const rebuilt = external
      ? `<a href="${safe}" target="_blank" rel="noopener noreferrer">${inner}</a>`
      : `<a href="${safe}">${inner}</a>`;
    const token = `@@SAFEA${keptAnchors.length}@@`;
    keptAnchors.push(rebuilt);
    return token;
  });

  html = html.replace(/<\/?a\b[^>]*>/gi, "");

  html = html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g,
    (match, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      const closing = match.startsWith("</");
      if (!ALLOWED.has(tag)) return "";
      if (closing) return `</${tag}>`;
      if (tag === "br") return "<br />";
      return `<${tag}>`;
    },
  );

  keptAnchors.forEach((anchor, index) => {
    html = html.replace(`@@SAFEA${index}@@`, anchor);
  });

  return html.trim();
}

export function simpleHtmlHint(): string {
  return "تگ‌های مجاز: <p> <strong> <em> <ul> <ol> <li> <a> <br>";
}
