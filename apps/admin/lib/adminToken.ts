import { ADMIN_STORAGE_KEYS } from "@drmojtahedi/shared";

export const adminTokenKeys = {
  access: ADMIN_STORAGE_KEYS.token,
  refresh: ADMIN_STORAGE_KEYS.refresh,
  user: "drmojtahedi-admin-user",
};

export function getStoredAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(adminTokenKeys.access);
}

export function setAdminTokens(access: string, refresh?: string, username?: string) {
  localStorage.setItem(adminTokenKeys.access, access);
  if (refresh) localStorage.setItem(adminTokenKeys.refresh, refresh);
  if (username) localStorage.setItem(adminTokenKeys.user, username);
}

export function clearAdminTokenStorage() {
  localStorage.removeItem(adminTokenKeys.access);
  localStorage.removeItem(adminTokenKeys.refresh);
  localStorage.removeItem(adminTokenKeys.user);
}
