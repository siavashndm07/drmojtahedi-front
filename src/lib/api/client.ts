import {
  getPublicApiUrl,
  getServerApiUrl,
  rewritePublicMediaUrlsDeep,
} from "@/lib/api/config";
import type { Paginated } from "@/lib/types";

export type ApiErrorBody = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody, fallback: string) {
    super(body.message || body.detail || fallback);
    this.status = status;
    this.body = body;
  }
}

function parseErrorBody(text: string): ApiErrorBody {
  if (!text) return {};
  try {
    return JSON.parse(text) as ApiErrorBody;
  } catch {
    return { message: text };
  }
}

type FetchOptions = RequestInit & {
  token?: string | null;
  /** Prefer browser public base vs SSR internal base */
  scope?: "public" | "server";
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, scope = "server", ...rest } = options;
  const base = scope === "public" ? getPublicApiUrl() : getServerApiUrl();
  if (!base) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${base}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await response.text();
  const body = parseErrorBody(text);

  if (!response.ok) {
    throw new ApiError(response.status, body, "درخواست API ناموفق بود");
  }

  if (!text) return {} as T;
  return rewritePublicMediaUrlsDeep(JSON.parse(text) as T);
}

export async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(
  path: string,
  data?: unknown,
  options?: FetchOptions,
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "POST",
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}

export async function apiPut<T>(
  path: string,
  data?: unknown,
  options?: FetchOptions,
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "PUT",
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}

export async function apiDelete<T>(
  path: string,
  options?: FetchOptions,
): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "DELETE" });
}

export async function unwrapList<T>(
  data: T[] | Paginated<T> | { results?: T[] },
): Promise<T[]> {
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}
