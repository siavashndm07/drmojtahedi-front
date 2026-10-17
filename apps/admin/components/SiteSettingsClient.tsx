"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Image as ImageIcon,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Palette,
  Phone,
  Share2,
  Shield,
  Type,
  Users,
} from "lucide-react";
import { mergeBrandColors, mergeSiteBanner } from "@drmojtahedi/shared";
import BrandColorsEditor from "@/components/BrandColorsEditor";
import ImageAssetField from "@/components/ImageAssetField";
import LocationMapPickerLazy from "@/components/LocationMapPickerLazy";
import PageHeader from "@/components/PageHeader";
import WatermarkPositionPicker from "@/components/WatermarkPositionPicker";
import { hasMapCoordinates } from "@/lib/geocode";
import {
  Checkbox,
  Field,
  FormAccordion,
  FormAccordionItem,
  FormActions,
  Input,
  NumberInput,
  Textarea,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  DEFAULT_WATERMARK_KINDS,
  getSiteSettings,
  SOCIAL_KEYS,
  SOCIAL_LABELS,
  updateSiteSettings,
  WATERMARK_MEDIA_KIND_OPTIONS,
  type SiteSettings,
  type SocialKey,
  type WatermarkMediaKind,
} from "@/lib/api/settings";
import {
  applyBrandColorsToDocument,
  notifyBrandColorsUpdated,
} from "@/lib/brandTheme";

const ACCORDION_KEY = "dm-site-settings-accordion";

const RELATED = [
  {
    href: "/settings/payments",
    label: "پرداخت و کمک مالی",
    hint: "درگاه، کارت‌به‌کارت و حالت آزمایشی",
    icon: CreditCard,
  },
  {
    href: "/settings/staff",
    label: "کاربران پنل",
    hint: "ایجاد ادمین و سطح دسترسی بخش‌ها",
    icon: Users,
  },
  {
    href: "/ai",
    label: "دستیار AI",
    hint: "تنظیمات دستیار هوشمند",
    icon: Shield,
  },
  {
    href: "/account",
    label: "حساب ادمین",
    hint: "رمز و اطلاعات ورود فعلی",
    icon: Building2,
  },
];

function emptyForm(): SiteSettings {
  return {
    nameFa: "",
    nameEn: "",
    tagline: "",
    taglineFa: "",
    summary: "",
    company: "",
    email: "",
    phone: "",
    phoneHref: "",
    phoneSecondary: "",
    whatsapp: "",
    whatsappHref: "",
    address: "",
    url: "",
    contactDescription: "",
    contactHours: "",
    mapLat: null,
    mapLon: null,
    social: {},
    metaDescription: "",
    metaKeywords: [],
    logo: "",
    logoId: null,
    logoDark: "",
    logoDarkId: null,
    favicon: "",
    faviconId: null,
    brandColors: mergeBrandColors(null),
    siteBanner: mergeSiteBanner(null),
    watermarkEnabled: false,
    watermarkOpacity: 0.35,
    watermarkPosition: "bottom_right",
    watermarkApplyKinds: [...DEFAULT_WATERMARK_KINDS],
    watermark: "",
    watermarkId: null,
  };
}

export default function SiteSettingsClient() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    nameFa?: string;
    nameEn?: string;
  }>({});

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getSiteSettings(accessToken);
        if (!cancelled) {
          const next = {
            ...emptyForm(),
            ...data,
            social: data.social ?? {},
            brandColors: mergeBrandColors(data.brandColors),
            siteBanner: mergeSiteBanner(data.siteBanner),
            watermarkApplyKinds:
              data.watermarkApplyKinds?.length
                ? data.watermarkApplyKinds
                : [...DEFAULT_WATERMARK_KINDS],
          };
          setForm(next);
          applyBrandColorsToDocument(next.brandColors);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
          setForm(emptyForm());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function patchSocial(key: SocialKey, value: string) {
    setForm((prev) =>
      prev
        ? { ...prev, social: { ...(prev.social ?? {}), [key]: value } }
        : prev,
    );
  }

  async function save() {
    if (!accessToken || !form) return;
    const nextErrors = {
      nameFa: form.nameFa.trim() ? undefined : "این فیلد الزامی است.",
      nameEn: form.nameEn.trim() ? undefined : "این فیلد الزامی است.",
    };
    setFieldErrors(nextErrors);
    if (nextErrors.nameFa || nextErrors.nameEn) return;
    setSaving(true);
    try {
      const saved = await updateSiteSettings(accessToken, form);
      const next = {
        ...emptyForm(),
        ...saved,
        social: saved.social ?? {},
        brandColors: mergeBrandColors(saved.brandColors),
        siteBanner: mergeSiteBanner(saved.siteBanner),
        watermarkApplyKinds:
          saved.watermarkApplyKinds?.length
            ? saved.watermarkApplyKinds
            : [...DEFAULT_WATERMARK_KINDS],
      };
      setForm(next);
      applyBrandColorsToDocument(next.brandColors);
      notifyBrandColorsUpdated();
      toast.success("تنظیمات سایت ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات سایت"
        description={
          loading
            ? "در حال بارگذاری…"
            : `هویت، تماس، رسانه و شبکه‌های اجتماعی بنیاد${isApiEnabled() ? "" : " (دمو)"}`
        }
      />

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {RELATED.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-ink/10 bg-surface p-4 transition hover:border-pine/30 hover:bg-mint-soft/30"
          >
            <item.icon className="h-4 w-4 text-pine" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-ink">{item.label}</p>
            <p className="mt-1 text-xs text-ink-muted">{item.hint}</p>
          </Link>
        ))}
      </section>

      {form ? (
        <div className="space-y-4">
          <FormAccordion
            defaultOpenIds={["visual", "banner", "brand"]}
            storageKey={ACCORDION_KEY}
          >
            <FormAccordionItem
              id="visual"
              title="هویت بصری"
              description="پالت رنگ برند و پس‌زمینه سایت"
              icon={Palette}
            >
              <BrandColorsEditor
                value={form.brandColors ?? mergeBrandColors(null)}
                onChange={(brandColors) => {
                  patch("brandColors", brandColors);
                  applyBrandColorsToDocument(brandColors);
                }}
              />
            </FormAccordionItem>

            <FormAccordionItem
              id="banner"
              title="اعلان سراسری سایت"
              description="بنر بالای هدر در همه صفحات سایت — متن یا تصویر"
              icon={Megaphone}
            >
              <div className="space-y-3">
                <Checkbox
                  id="banner-enabled"
                  label="نمایش بنر در بالای سایت"
                  checked={Boolean(form.siteBanner?.enabled)}
                  onChange={(e) =>
                    patch("siteBanner", {
                      ...mergeSiteBanner(form.siteBanner),
                      enabled: e.target.checked,
                    })
                  }
                />
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: "text" as const, label: "متن" },
                      { value: "image" as const, label: "تصویر / GIF" },
                    ] as const
                  ).map((opt) => {
                    const active = (form.siteBanner?.mode ?? "text") === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          patch("siteBanner", {
                            ...mergeSiteBanner(form.siteBanner),
                            mode: opt.value,
                          })
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? "bg-pine text-white"
                            : "bg-cream text-ink-muted ring-1 ring-ink/10 hover:text-ink dark:bg-mint/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {(form.siteBanner?.mode ?? "text") === "image" ? (
                  <ImageAssetField
                    label="تصویر یا GIF بنر"
                    hint="برای اعلان‌های متحرک GIF آپلود کنید — عرض کامل بالای هدر"
                    kind="hero"
                    imageId={form.siteBanner?.imageId || null}
                    imageUrl={form.siteBanner?.imageUrl ?? ""}
                    aspectClass="aspect-[6/1]"
                    objectFit="contain"
                    removeDescription="تصویر اعلان سراسری حذف می‌شود."
                    onChange={({ id, url }) =>
                      patch("siteBanner", {
                        ...mergeSiteBanner(form.siteBanner),
                        imageId: id ?? "",
                        imageUrl: url,
                      })
                    }
                  />
                ) : (
                  <Field label="پیام" htmlFor="banner-msg">
                    <Textarea
                      id="banner-msg"
                      rows={2}
                      className="min-h-[3rem]"
                      value={form.siteBanner?.message ?? ""}
                      onChange={(e) =>
                        patch("siteBanner", {
                          ...mergeSiteBanner(form.siteBanner),
                          message: e.target.value,
                        })
                      }
                    />
                  </Field>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="لینک (اختیاری)" htmlFor="banner-link">
                    <Input
                      id="banner-link"
                      value={form.siteBanner?.link ?? ""}
                      dir="ltr"
                      className="text-start"
                      icon={<Link2 className="h-4 w-4" aria-hidden />}
                      onChange={(e) =>
                        patch("siteBanner", {
                          ...mergeSiteBanner(form.siteBanner),
                          link: e.target.value,
                        })
                      }
                    />
                  </Field>
                  {(form.siteBanner?.mode ?? "text") === "text" ? (
                    <Field label="متن لینک" htmlFor="banner-link-label">
                      <Input
                        id="banner-link-label"
                        value={form.siteBanner?.linkLabel ?? ""}
                        icon={<Type className="h-4 w-4" aria-hidden />}
                        onChange={(e) =>
                          patch("siteBanner", {
                            ...mergeSiteBanner(form.siteBanner),
                            linkLabel: e.target.value,
                          })
                        }
                      />
                    </Field>
                  ) : null}
                </div>
              </div>
            </FormAccordionItem>

            <FormAccordionItem
              id="brand"
              title="هویت برند"
              description="نام، شعار و معرفی کوتاه بنیاد"
              icon={Building2}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="نام فارسی"
                  htmlFor="name-fa"
                  error={fieldErrors.nameFa}
                >
                  <Input
                    id="name-fa"
                    value={form.nameFa}
                    error={!!fieldErrors.nameFa}
                    onChange={(e) => {
                      patch("nameFa", e.target.value);
                      setFieldErrors((prev) => ({ ...prev, nameFa: undefined }));
                    }}
                  />
                </Field>
                <Field
                  label="نام انگلیسی"
                  htmlFor="name-en"
                  error={fieldErrors.nameEn}
                >
                  <Input
                    id="name-en"
                    value={form.nameEn}
                    error={!!fieldErrors.nameEn}
                    onChange={(e) => {
                      patch("nameEn", e.target.value);
                      setFieldErrors((prev) => ({ ...prev, nameEn: undefined }));
                    }}
                    dir="ltr"
                    className="text-start"
                  />
                </Field>
                <Field label="شعار (فارسی)" htmlFor="tagline-fa" className="sm:col-span-2">
                  <Input
                    id="tagline-fa"
                    value={form.taglineFa || form.tagline || ""}
                    onChange={(e) => {
                      patch("taglineFa", e.target.value);
                      patch("tagline", e.target.value);
                    }}
                  />
                </Field>
                <Field label="نام حقوقی / شرکت" htmlFor="company">
                  <Input
                    id="company"
                    value={form.company ?? ""}
                    onChange={(e) => patch("company", e.target.value)}
                  />
                </Field>
                <Field label="آدرس سایت" htmlFor="url">
                  <Input
                    id="url"
                    value={form.url ?? ""}
                    onChange={(e) => patch("url", e.target.value)}
                    dir="ltr"
                    className="text-start"
                    placeholder="https://…"
                  />
                </Field>
                <Field label="خلاصه معرفی" htmlFor="summary" className="sm:col-span-2">
                  <Textarea
                    id="summary"
                    rows={3}
                    value={form.summary ?? ""}
                    onChange={(e) => patch("summary", e.target.value)}
                  />
                </Field>
              </div>
            </FormAccordionItem>

            <FormAccordionItem
              id="media"
              title="رسانه و واترمارک"
              description="لوگو، فاویکون و واترمارک خودکار روی آپلود تصاویر"
              icon={ImageIcon}
            >
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ImageAssetField
                    label="لوگو"
                    hint="هدر، فوتر و ورود — PNG شفاف، حدود ۱۴۰px"
                    kind="logo"
                    imageId={form.logoId ?? null}
                    imageUrl={form.logo ?? ""}
                    aspectClass="aspect-[3/1]"
                    objectFit="contain"
                    onChange={({ id, url }) => {
                      patch("logoId", id);
                      patch("logo", url);
                    }}
                  />
                  <ImageAssetField
                    label="لوگو تیره"
                    hint="اختیاری — برای هدر در dark mode"
                    kind="logo"
                    imageId={form.logoDarkId ?? null}
                    imageUrl={form.logoDark ?? ""}
                    aspectClass="aspect-[3/1]"
                    objectFit="contain"
                    onChange={({ id, url }) => {
                      patch("logoDarkId", id);
                      patch("logoDark", url);
                    }}
                  />
                  <ImageAssetField
                    label="فاویکون"
                    kind="logo"
                    imageId={form.faviconId ?? null}
                    imageUrl={form.favicon ?? ""}
                    aspectClass="aspect-square max-w-[160px]"
                    objectFit="contain"
                    onChange={({ id, url }) => {
                      patch("faviconId", id);
                      patch("favicon", url);
                    }}
                  />
                </div>

                <div className="rounded-2xl border border-ink/10 bg-cream/25 p-5 dark:bg-mint/10 sm:p-6">
                  <p className="mb-6 text-sm font-semibold text-ink">تنظیمات واترمارک</p>

                  <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                    <ImageAssetField
                      label="تصویر واترمارک"
                      hint="لوگوی شفاف PNG — معمولاً همان لوگوی بنیاد با پس‌زمینه شفاف"
                      kind="logo"
                      imageId={form.watermarkId ?? null}
                      imageUrl={form.watermark ?? ""}
                      aspectClass="aspect-square w-full max-w-[280px]"
                      objectFit="contain"
                      removeDescription="واترمارک حذف می‌شود."
                      onChange={({ id, url }) => {
                        setForm((prev) =>
                          prev ? { ...prev, watermarkId: id, watermark: url } : prev,
                        );
                      }}
                    />

                    <div className="space-y-6">
                      <Field
                        label="شفافیت واترمارک"
                        htmlFor="watermark-opacity"
                        hint="۰.۱ کم‌رنگ — ۱ کاملاً پررنگ"
                        className="max-w-xs"
                      >
                        <NumberInput
                          id="watermark-opacity"
                          value={form.watermarkOpacity ?? 0.35}
                          min={0.05}
                          max={1}
                          step={0.05}
                          onChange={(next) => patch("watermarkOpacity", next ?? 0.35)}
                        />
                      </Field>

                      <Field
                        label="موقعیت واترمارک"
                        hint="روی پیش‌نمای کلیک کنید یا یکی از برچسب‌ها را بزنید"
                      >
                        <WatermarkPositionPicker
                          value={form.watermarkPosition ?? "bottom_right"}
                          onChange={(next) => patch("watermarkPosition", next)}
                          watermarkUrl={form.watermark || undefined}
                          opacity={form.watermarkOpacity ?? 0.35}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 border-t border-ink/10 pt-6 lg:flex-row lg:items-start lg:gap-10">
                    <Checkbox
                      id="watermark-enabled"
                      label="فعال‌سازی واترمارک"
                      description="روی تصاویر هنگام آپلود در پنل اعمال می‌شود."
                      checked={Boolean(form.watermarkEnabled)}
                      onChange={(e) => patch("watermarkEnabled", e.target.checked)}
                      className="shrink-0 lg:max-w-xs"
                    />

                    <div className="min-w-0 flex-1 space-y-3">
                      <p className="text-sm font-medium text-ink">اعمال واترمارک روی</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {WATERMARK_MEDIA_KIND_OPTIONS.map((option) => {
                          const kinds = form.watermarkApplyKinds ?? [];
                          const checked = kinds.includes(option.id);
                          return (
                            <Checkbox
                              key={option.id}
                              id={`watermark-kind-${option.id}`}
                              label={option.label}
                              checked={checked}
                              onChange={(e) => {
                                const next = new Set(kinds);
                                if (e.target.checked) next.add(option.id);
                                else next.delete(option.id);
                                patch(
                                  "watermarkApplyKinds",
                                  Array.from(next) as WatermarkMediaKind[],
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormAccordionItem>

            <FormAccordionItem
              id="contact"
              title="تماس و آدرس"
              description="شماره، ایمیل، ساعات و موقعیت"
              icon={Phone}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="تلفن" htmlFor="phone">
                  <Input
                    id="phone"
                    value={form.phone ?? ""}
                    onChange={(e) => patch("phone", e.target.value)}
                    dir="ltr"
                    className="text-start"
                  />
                </Field>
                <Field label="لینک تلفن (tel:)" htmlFor="phone-href">
                  <Input
                    id="phone-href"
                    value={form.phoneHref ?? ""}
                    onChange={(e) => patch("phoneHref", e.target.value)}
                    dir="ltr"
                    className="text-start"
                    placeholder="tel:+9821…"
                  />
                </Field>
                <Field label="تلفن دوم" htmlFor="phone2">
                  <Input
                    id="phone2"
                    value={form.phoneSecondary ?? ""}
                    onChange={(e) => patch("phoneSecondary", e.target.value)}
                    dir="ltr"
                    className="text-start"
                  />
                </Field>
                <Field label="ایمیل" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => patch("email", e.target.value)}
                    dir="ltr"
                    className="text-start"
                  />
                </Field>
                <Field label="ساعات پاسخگویی" htmlFor="hours" className="sm:col-span-2">
                  <Input
                    id="hours"
                    value={form.contactHours ?? ""}
                    onChange={(e) => patch("contactHours", e.target.value)}
                    placeholder="شنبه تا چهارشنبه ۹–۱۷"
                  />
                </Field>
                <Field label="توضیح تماس" htmlFor="contact-desc" className="sm:col-span-2">
                  <Textarea
                    id="contact-desc"
                    rows={2}
                    value={form.contactDescription ?? ""}
                    onChange={(e) => patch("contactDescription", e.target.value)}
                  />
                </Field>
                <div className="sm:col-span-2 space-y-3">
                  <p className="text-sm font-medium text-ink">موقعیت روی نقشه</p>
                  <LocationMapPickerLazy
                    value={
                      hasMapCoordinates({
                        lat: form.mapLat ?? undefined,
                        lon: form.mapLon ?? undefined,
                      })
                        ? { lat: form.mapLat as number, lon: form.mapLon as number }
                        : null
                    }
                    onChange={(coords) => {
                      setForm((prev) =>
                        prev
                          ? { ...prev, mapLat: coords.lat, mapLon: coords.lon }
                          : prev,
                      );
                    }}
                    onAddressSuggestion={(line) => {
                      setForm((prev) =>
                        prev ? { ...prev, address: line } : prev,
                      );
                    }}
                  />
                  <Field label="آدرس" htmlFor="address">
                    <Textarea
                      id="address"
                      rows={2}
                      value={form.address ?? ""}
                      onChange={(e) => patch("address", e.target.value)}
                      placeholder="آدرس کامل — با انتخاب روی نقشه پیشنهاد می‌شود"
                    />
                  </Field>
                </div>
              </div>
            </FormAccordionItem>

            <FormAccordionItem
              id="seo"
              title="سئو"
              description="توضیح متا برای موتورهای جستجو"
              icon={Mail}
            >
              <Field label="Meta description" htmlFor="meta-desc">
                <Textarea
                  id="meta-desc"
                  rows={3}
                  value={form.metaDescription ?? ""}
                  onChange={(e) => patch("metaDescription", e.target.value)}
                />
              </Field>
              <Field
                label="کلمات کلیدی"
                htmlFor="meta-kw"
                hint="با ویرگول جدا کنید"
              >
                <Input
                  id="meta-kw"
                  value={(form.metaKeywords ?? []).join("، ")}
                  onChange={(e) =>
                    patch(
                      "metaKeywords",
                      e.target.value
                        .split(/[,،]/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
            </FormAccordionItem>

            <FormAccordionItem
              id="social"
              title="شبکه‌های اجتماعی"
              description="لینک‌های عمومی در فوتر و صفحه تماس"
              icon={Share2}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_KEYS.map((key) => (
                  <Field key={key} label={SOCIAL_LABELS[key]} htmlFor={`social-${key}`}>
                    <Input
                      id={`social-${key}`}
                      value={form.social?.[key] ?? ""}
                      onChange={(e) => patchSocial(key, e.target.value)}
                      dir="ltr"
                      className="text-start"
                      placeholder="https://…"
                    />
                  </Field>
                ))}
              </div>
            </FormAccordionItem>
          </FormAccordion>

          <FormActions>
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => void save()}
              className="btn-primary"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              ذخیره تنظیمات
            </button>
            <Link href="/settings/payments" className="btn-secondary inline-flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              پرداخت
            </Link>
            <Link href="/settings/staff" className="btn-secondary inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              کاربران پنل
            </Link>
            <span className="ms-auto inline-flex items-center gap-1 text-xs text-ink-muted">
              <MapPin className="h-3.5 w-3.5" />
              تنظیمات عمومی بنیاد
            </span>
          </FormActions>
        </div>
      ) : null}
    </div>
  );
}
