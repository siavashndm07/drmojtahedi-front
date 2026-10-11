/**
 * API base URL helpers — pattern carried from SensibleCool:
 * - public URL for browser
 * - optional internal URL for SSR (avoid CDN hairpin)
 * - seed/mock mode when API is unavailable
 */

function trimBase(value: string): string {
  return value.trim().replace(/\/$/, "");
}

export function useSeedData(): boolean {
  return process.env.NEXT_PUBLIC_USE_SEED === "true";
}

export function getPublicApiUrl(): string | null {
  if (useSeedData()) return null;
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (typeof configured === "string" && configured.trim()) {
    return trimBase(configured);
  }
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000/api/v1";
  }
  return null;
}

export function getServerApiUrl(): string | null {
  if (typeof window !== "undefined") return getPublicApiUrl();
  if (useSeedData()) return null;
  const internal = process.env.API_INTERNAL_URL;
  if (typeof internal === "string" && internal.trim()) {
    return trimBase(internal);
  }
  return getPublicApiUrl();
}

export function isApiEnabled(): boolean {
  return Boolean(getPublicApiUrl());
}

export function getPublicMediaBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (typeof configured === "string" && configured.trim()) {
    return trimBase(configured);
  }
  const api = getPublicApiUrl();
  if (!api) return null;
  try {
    const url = new URL(api);
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function rewritePublicMediaUrl(value: string): string {
  if (!value) return value;
  const mediaBase = getPublicMediaBaseUrl();
  if (!mediaBase) return value;
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const url = new URL(value);
      if (
        (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
        url.pathname.startsWith("/media/")
      ) {
        return `${mediaBase}${url.pathname}${url.search}`;
      }
      return value;
    }
    if (value.startsWith("/media/")) {
      return `${mediaBase}${value}`;
    }
  } catch {
    /* keep original */
  }
  return value;
}

export function rewritePublicMediaUrlsDeep<T>(input: T): T {
  if (input == null) return input;
  if (typeof input === "string") return rewritePublicMediaUrl(input) as T;
  if (Array.isArray(input)) {
    return input.map((item) => rewritePublicMediaUrlsDeep(item)) as T;
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      out[key] = rewritePublicMediaUrlsDeep(value);
    }
    return out as T;
  }
  return input;
}
