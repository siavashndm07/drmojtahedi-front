import { apiFetch } from "@/lib/api/client";
import type { UserProfile } from "@/lib/auth";

export type AuthUserResponse = UserProfile & {
  phone: string;
};

export type OtpVerifyResponse = {
  success: boolean;
  message?: string;
  access?: string;
  refresh?: string;
  user?: AuthUserResponse;
};

export async function apiSendOtp(phone: string) {
  return apiFetch<{ success: boolean; message?: string }>("/auth/otp/send/", {
    method: "POST",
    scope: "public",
    body: JSON.stringify({ phone }),
  });
}

export async function apiVerifyOtp(phone: string, code: string) {
  return apiFetch<OtpVerifyResponse>("/auth/otp/verify/", {
    method: "POST",
    scope: "public",
    body: JSON.stringify({ phone, code }),
  });
}

export async function apiGetMe(token: string) {
  return apiFetch<AuthUserResponse>("/auth/me/", {
    token,
    scope: "public",
  });
}

export async function apiPatchMe(token: string, patch: Partial<UserProfile>) {
  return apiFetch<AuthUserResponse>("/auth/me/", {
    method: "PATCH",
    token,
    scope: "public",
    body: JSON.stringify(patch),
  });
}
