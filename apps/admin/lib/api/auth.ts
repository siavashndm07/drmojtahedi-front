import { apiFetch } from "@/lib/api/client";

export type AdminMe = {
  username: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  isSuperuser?: boolean;
  permissions?: string[];
};

export async function apiAdminLogin(username: string, password: string) {
  return apiFetch<{
    access: string;
    refresh: string;
    user?: AdminMe;
  }>("/auth/admin/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function apiAdminMe(token: string) {
  return apiFetch<AdminMe>("/auth/admin/me/", { token });
}

export async function apiAdminRefresh(refresh: string) {
  return apiFetch<{ access: string }>("/auth/admin/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}
