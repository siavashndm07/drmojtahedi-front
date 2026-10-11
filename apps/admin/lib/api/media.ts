import { getStoredAdminToken } from "@/lib/adminToken";
import { ApiError, getApiBase } from "@/lib/api/client";

export type UploadedMedia = {
  id: string;
  kind: string;
  url: string;
  altText?: string;
  createdAt?: string;
};

async function parseJsonBody(text: string): Promise<Record<string, unknown>> {
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
}

export async function uploadMedia(
  file: File,
  kind = "news",
): Promise<UploadedMedia> {
  const base = getApiBase();
  if (!base) throw new Error("API URL is not configured");
  const token = getStoredAdminToken();
  if (!token) throw new Error("وارد پنل نشده‌اید.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const response = await fetch(`${base}/media/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const text = await response.text();
  const body = await parseJsonBody(text);

  if (!response.ok) {
    throw new ApiError(response.status, body, "آپلود تصویر ناموفق بود");
  }

  return body as UploadedMedia;
}
