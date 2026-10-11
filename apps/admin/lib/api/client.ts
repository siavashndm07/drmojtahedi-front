export class ApiError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>, fallback: string) {
    super(
      (typeof body.message === "string" && body.message) ||
        (typeof body.detail === "string" && body.detail) ||
        fallback,
    );
    this.status = status;
    this.body = body;
  }
}

export function getApiBase(): string | null {
  if (process.env.NEXT_PUBLIC_USE_SEED === "true") return null;
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000/api/v1";
  }
  return null;
}

export function isApiEnabled() {
  return Boolean(getApiBase());
}

type Options = RequestInit & { token?: string | null };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const base = getApiBase();
  if (!base) throw new Error("API URL is not configured");
  const { token, headers, ...rest } = options;
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
  let body: Record<string, unknown> = {};
  try {
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    body = { message: text };
  }
  if (!response.ok) {
    throw new ApiError(response.status, body, "درخواست ناموفق بود");
  }
  return body as T;
}
