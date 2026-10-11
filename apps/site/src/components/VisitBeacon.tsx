"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const COOKIE = "dm_vid";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 400;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function ensureVisitorKey(): string {
  let key = readCookie(COOKIE);
  if (key && /^[a-zA-Z0-9_-]{8,64}$/.test(key)) return key;
  key =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  writeCookie(COOKIE, key);
  return key;
}

function getApiBase(): string | null {
  if (process.env.NEXT_PUBLIC_USE_SEED === "true") return null;
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000/api/v1";
  }
  return null;
}

export default function VisitBeacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const base = getApiBase();
    if (!base || !pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const visitorKey = ensureVisitorKey();
    void fetch(`${base}/analytics/visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorKey, path: pathname }),
      keepalive: true,
    }).catch(() => {
      /* ignore beacon errors */
    });
  }, [pathname]);

  return null;
}
