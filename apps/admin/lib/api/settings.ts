import { apiFetch } from "@/lib/api/client";
import {
  mergeBrandColors,
  mergeHomeSections,
  mergeSiteBanner,
  normalizeHeroAutoplayDelay,
  normalizeHeroTemplateId,
  normalizeHomeSectionOrder,
  type BrandColors,
  type HeroTemplateId,
  type HomeSectionKey,
  type HomeSections,
  type SiteBanner,
} from "@drmojtahedi/shared";

export type { BrandColors, HomeSectionKey, HomeSections, SiteBanner };

export type WatermarkPosition =
  | "bottom_right"
  | "bottom_left"
  | "top_right"
  | "top_left"
  | "center";

export type WatermarkMediaKind =
  | "news"
  | "articles"
  | "people"
  | "archive"
  | "hero"
  | "sponsors";

export const WATERMARK_MEDIA_KIND_OPTIONS: {
  id: WatermarkMediaKind;
  label: string;
}[] = [
  { id: "news", label: "اخبار" },
  { id: "articles", label: "مقالات" },
  { id: "people", label: "افراد" },
  { id: "archive", label: "آرشیو" },
  { id: "hero", label: "اسلایدر / هیرو" },
  { id: "sponsors", label: "حامیان" },
];

export const DEFAULT_WATERMARK_KINDS: WatermarkMediaKind[] = [
  "news",
  "articles",
  "people",
  "archive",
  "hero",
  "sponsors",
];

export const BRAND_COLOR_LABELS: Partial<Record<keyof BrandColors, string>> = {
  pine: "رنگ اصلی",
  pineDark: "رنگ اصلی تیره",
  mint: "پس‌زمینه ملایم",
  mintSoft: "پس‌زمینه روشن",
  mintDeep: "رنگ تاکید",
  accent: "رنگ accent (نشان‌ها)",
};

export const SOCIAL_KEYS = [
  "instagram",
  "telegram",
  "whatsapp",
  "twitter",
  "linkedin",
  "bale",
  "eita",
  "rubika",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "اینستاگرام",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  twitter: "توییتر",
  linkedin: "لینکدین",
  bale: "بله",
  eita: "ایتا",
  rubika: "روبیکا",
};

export type SiteSettings = {
  id?: number;
  key?: string;
  nameFa: string;
  nameEn: string;
  tagline?: string;
  taglineFa?: string;
  summary?: string;
  company?: string;
  email?: string;
  phone?: string;
  phoneHref?: string;
  phoneSecondary?: string;
  whatsapp?: string;
  whatsappHref?: string;
  address?: string;
  url?: string;
  contactDescription?: string;
  contactHours?: string;
  mapLat?: number | null;
  mapLon?: number | null;
  social?: Partial<Record<SocialKey, string>>;
  metaDescription?: string;
  metaKeywords?: string[];
  logo?: string;
  logoId?: string | null;
  logoDark?: string;
  logoDarkId?: string | null;
  favicon?: string;
  faviconId?: string | null;
  brandColors?: BrandColors;
  siteBanner?: SiteBanner;
  watermarkEnabled?: boolean;
  watermarkOpacity?: number;
  watermarkPosition?: WatermarkPosition;
  watermarkApplyKinds?: WatermarkMediaKind[];
  watermark?: string;
  watermarkId?: string | null;
  homeSections?: HomeSections;
  homeSectionOrder?: HomeSectionKey[];
  heroTemplate?: HeroTemplateId;
  heroAutoplayDelay?: number;
};

export type PaymentGateway =
  | "none"
  | "zarinpal"
  | "zibal"
  | "sep"
  | "pasargad"
  | "mellat"
  | "irankish";

export const SUPPORTED_PAYMENT_GATEWAYS: PaymentGateway[] = [
  "none",
  "zarinpal",
  "zibal",
  "sep",
  "pasargad",
  "mellat",
  "irankish",
];

export type OnlinePaymentGateway = Exclude<PaymentGateway, "none">;

export type PaymentGatewayConfig = {
  id: OnlinePaymentGateway;
  label: string;
  enabled: boolean;
  sandbox: boolean;
  merchantIdSet: boolean;
  merchantCode?: string;
  usernameSet?: boolean;
  privateKeySet?: boolean;
  publicKeySet?: boolean;
  /** Pasargad Dorsa base URL, e.g. https://pep.shaparak.ir/dorsa1 */
  baseUrl?: string;
};

export type AiProvider = "openai" | "grok";

export type OpsSettings = {
  id?: number;
  cashOnDelivery?: boolean;
  cardToCard?: boolean;
  cardHolder?: string;
  cardNumber?: string;
  donateMessage?: string;
  gateway?: PaymentGateway;
  defaultGateway?: PaymentGateway;
  gatewayLabel?: string;
  paymentGateways?: PaymentGatewayConfig[];
  sandbox?: boolean;
  merchantId?: string;
  merchantIdSet?: boolean;
  gatewayMerchantCode?: string;
  gatewayPrivateKey?: string;
  gatewayPrivateKeySet?: boolean;
  aiEnabled?: boolean;
  aiProvider?: AiProvider;
  aiApiKey?: string;
  aiApiKeySet?: boolean;
  aiModel?: string;
  aiBaseUrl?: string;
  aiWelcomeMessage?: string;
  aiSystemExtra?: string;
};

export type AdminStaff = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  permissions: string[];
  lastLogin?: string | null;
  lastLoginIp?: string | null;
  dateJoined?: string | null;
};

function normalizeSiteSettings(data: SiteSettings): SiteSettings {
  return {
    ...data,
    brandColors: mergeBrandColors(data.brandColors),
    siteBanner: mergeSiteBanner(data.siteBanner),
    watermarkEnabled: Boolean(data.watermarkEnabled),
    watermarkOpacity:
      typeof data.watermarkOpacity === "number" ? data.watermarkOpacity : 0.35,
    watermarkPosition: data.watermarkPosition ?? "bottom_right",
    watermarkApplyKinds:
      data.watermarkApplyKinds?.length
        ? data.watermarkApplyKinds
        : [...DEFAULT_WATERMARK_KINDS],
    watermark: data.watermark ?? "",
    watermarkId: data.watermarkId ?? null,
    homeSections: mergeHomeSections(data.homeSections),
    homeSectionOrder: normalizeHomeSectionOrder(data.homeSectionOrder),
    heroTemplate: normalizeHeroTemplateId(data.heroTemplate),
    heroAutoplayDelay: normalizeHeroAutoplayDelay(data.heroAutoplayDelay),
  };
}

export async function getSiteSettings(token: string) {
  const data = await apiFetch<SiteSettings>("/admin/settings/site/", { token });
  return normalizeSiteSettings(data);
}

export async function updateSiteSettings(token: string, payload: Partial<SiteSettings>) {
  const data = await apiFetch<SiteSettings>("/admin/settings/site/", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
  return normalizeSiteSettings(data);
}

export async function getOpsSettings(token: string) {
  return apiFetch<OpsSettings>("/admin/settings/ops/", { token });
}

export async function updateOpsSettings(
  token: string,
  payload: Omit<Partial<OpsSettings>, "paymentGateways"> & {
    paymentGateways?: Array<
      Partial<PaymentGatewayConfig> & {
        id: OnlinePaymentGateway;
        merchantId?: string;
        username?: string;
        privateKey?: string;
        publicKey?: string;
      }
    >;
  },
) {
  return apiFetch<OpsSettings>("/admin/settings/ops/", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function testAiAssistant(
  token: string,
  payload?: {
    apiKey?: string;
    provider?: AiProvider;
    model?: string;
    baseUrl?: string;
  },
): Promise<{ ok: boolean; detail: string }> {
  return apiFetch("/admin/settings/ops/test-ai/", {
    method: "POST",
    token,
    body: JSON.stringify(payload ?? {}),
  });
}

export async function getStaff(token: string) {
  return apiFetch<AdminStaff[]>("/admin/staff/", { token });
}

export async function createStaff(
  token: string,
  payload: {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isSuperuser?: boolean;
    permissions?: string[];
    requirePasswordComplexity?: boolean;
  },
) {
  return apiFetch<AdminStaff>("/admin/staff/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateStaff(
  token: string,
  id: number,
  payload: Partial<{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    isSuperuser: boolean;
    permissions: string[];
    requirePasswordComplexity: boolean;
  }>,
) {
  return apiFetch<AdminStaff>(`/admin/staff/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deactivateStaff(token: string, id: number) {
  return apiFetch(`/admin/staff/${id}/`, { method: "DELETE", token });
}
