type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

/**
 * Analytics abstraction — wire GA/Matomo later without scattering SDKs.
 */
export function trackEvent(name: string, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, payload ?? {});
  }
  window.dispatchEvent(
    new CustomEvent("heritage:analytics", {
      detail: { name, payload },
    }),
  );
}
