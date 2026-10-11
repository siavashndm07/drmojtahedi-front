import { isApiEnabled } from "@/lib/api/config";
import { apiPost } from "@/lib/api/client";

export async function subscribeNewsletter(email: string): Promise<{ success: boolean }> {
  if (!isApiEnabled()) {
    return { success: true };
  }
  return apiPost<{ success: boolean }>("/newsletter/", { email }, { scope: "public" });
}

export type ContributePayload = {
  type: string;
  name: string;
  phone?: string;
  email?: string;
  title: string;
  body: string;
};

export async function submitContribution(
  payload: ContributePayload,
): Promise<{ id?: number | string }> {
  if (!isApiEnabled()) {
    return { id: `local-${Date.now()}` };
  }
  return apiPost("/contribute/", payload, { scope: "public" });
}
