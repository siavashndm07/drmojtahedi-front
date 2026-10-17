"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  CreditCard,
  Hash,
  KeyRound,
  Loader2,
  MessageSquareText,
  Star,
  User,
} from "lucide-react";
import { sanitizeSimpleHtml } from "@drmojtahedi/shared";
import PageHeader from "@/components/PageHeader";
import {
  Checkbox,
  Field,
  FormAccordion,
  FormAccordionItem,
  FormActions,
  Input,
  Select,
  SimpleHtmlEditor,
  Textarea,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  getOpsSettings,
  updateOpsSettings,
  type OnlinePaymentGateway,
  type OpsSettings,
  type PaymentGatewayConfig,
} from "@/lib/api/settings";
import { PaymentGatewayIcon } from "@/components/PaymentGatewayIcons";

const PASARGAD_BASE_URLS = [
  { value: "https://pep.shaparak.ir/dorsa1", label: "dorsa1 (پیش‌فرض)" },
  { value: "https://pep.shaparak.ir/dorsa2", label: "dorsa2" },
  { value: "https://pep.shaparak.ir/dorsa3", label: "dorsa3" },
] as const;

const ONLINE_GATEWAYS: {
  id: OnlinePaymentGateway;
  title: string;
  hint: string;
  keyLabel: string;
  keyHint: string;
  supportsSandbox: boolean;
}[] = [
  {
    id: "zarinpal",
    title: "زرین‌پال",
    hint: "درگاه آنلاین با حالت آزمایشی.",
    keyLabel: "Merchant ID",
    keyHint: "از پنل زرین‌پال → درگاه‌ها کپی کنید.",
    supportsSandbox: true,
  },
  {
    id: "zibal",
    title: "زیبال",
    hint: "در sandbox می‌توانید مرچنت zibal بگذارید.",
    keyLabel: "Merchant ID",
    keyHint: "از پنل زیبال → درگاه‌ها کپی کنید.",
    supportsSandbox: true,
  },
  {
    id: "sep",
    title: "سامان (SEP)",
    hint: "Terminal ID از پنل سامان.",
    keyLabel: "Terminal ID",
    keyHint: "شناسه ترمینال از پنل سامان کیش.",
    supportsSandbox: false,
  },
  {
    id: "pasargad",
    title: "پاسارگاد (PEP / pep.co)",
    hint: "Terminal Number، Merchant Code، نام کاربری و رمز عبور درگاه درسا.",
    keyLabel: "Terminal Number",
    keyHint: "شماره ترمینال عددی از پنل my.pep.co.ir.",
    supportsSandbox: true,
  },
  {
    id: "mellat",
    title: "بانک ملت (به‌پرداخت)",
    hint: "Terminal ID، نام کاربری و رمز از پنل به‌پرداخت ملت.",
    keyLabel: "Terminal ID",
    keyHint: "شناسه ترمینال عددی از پنل بانک ملت.",
    supportsSandbox: true,
  },
  {
    id: "irankish",
    title: "تجارت / ایران‌کیش",
    hint: "Terminal ID، Acceptor ID، رمز عبور و کلید عمومی RSA از ایران‌کیش (بانک تجارت).",
    keyLabel: "Terminal ID",
    keyHint: "شماره پایانه ۸ رقمی از پنل ایران‌کیش.",
    supportsSandbox: false,
  },
];

type DraftSecrets = Record<OnlinePaymentGateway, string>;
type DraftCodes = Record<OnlinePaymentGateway, string>;
type DraftKeys = Record<OnlinePaymentGateway, string>;
type DraftUsernames = Record<OnlinePaymentGateway, string>;
type DraftBaseUrls = Record<OnlinePaymentGateway, string>;
type DraftPublicKeys = Record<OnlinePaymentGateway, string>;

const EMPTY_DRAFTS = (): DraftSecrets =>
  Object.fromEntries(ONLINE_GATEWAYS.map((g) => [g.id, ""])) as DraftSecrets;

function gatewayRow(
  gateways: PaymentGatewayConfig[] | undefined,
  id: OnlinePaymentGateway,
): PaymentGatewayConfig {
  return (
    gateways?.find((row) => row.id === id) ?? {
      id,
      label: ONLINE_GATEWAYS.find((g) => g.id === id)?.title ?? id,
      enabled: false,
      sandbox: id !== "sep",
      merchantIdSet: false,
      merchantCode: "",
      usernameSet: false,
      privateKeySet: false,
      publicKeySet: false,
      baseUrl: id === "pasargad" ? PASARGAD_BASE_URLS[0].value : "",
    }
  );
}

export default function PaymentsSettingsClient() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<OpsSettings | null>(null);
  const [merchantDrafts, setMerchantDrafts] = useState<DraftSecrets>(EMPTY_DRAFTS);
  const [codeDrafts, setCodeDrafts] = useState<DraftCodes>(EMPTY_DRAFTS);
  const [usernameDrafts, setUsernameDrafts] = useState<DraftUsernames>(EMPTY_DRAFTS);
  const [keyDrafts, setKeyDrafts] = useState<DraftKeys>(EMPTY_DRAFTS);
  const [baseUrlDrafts, setBaseUrlDrafts] = useState<DraftBaseUrls>(EMPTY_DRAFTS);
  const [publicKeyDrafts, setPublicKeyDrafts] = useState<DraftPublicKeys>(EMPTY_DRAFTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getOpsSettings(accessToken!);
        if (!cancelled) {
          setForm(data);
          setMerchantDrafts(EMPTY_DRAFTS());
          setCodeDrafts(EMPTY_DRAFTS());
          setUsernameDrafts(EMPTY_DRAFTS());
          setKeyDrafts(EMPTY_DRAFTS());
          setBaseUrlDrafts(EMPTY_DRAFTS());
          setPublicKeyDrafts(EMPTY_DRAFTS());
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const enabledCount = useMemo(
    () => (form?.paymentGateways ?? []).filter((row) => row.enabled).length,
    [form?.paymentGateways],
  );

  function patchGateway(id: OnlinePaymentGateway, patch: Partial<PaymentGatewayConfig>) {
    if (!form) return;
    const current = gatewayRow(form.paymentGateways, id);
    const next = (form.paymentGateways ?? []).filter((row) => row.id !== id);
    next.push({ ...current, ...patch, id });
    next.sort(
      (a, b) =>
        ONLINE_GATEWAYS.findIndex((g) => g.id === a.id) -
        ONLINE_GATEWAYS.findIndex((g) => g.id === b.id),
    );
    setForm({ ...form, paymentGateways: next });
  }

  function setDefaultGateway(id: OnlinePaymentGateway) {
    if (!form) return;
    const current = gatewayRow(form.paymentGateways, id);
    const next = (form.paymentGateways ?? []).filter((row) => row.id !== id);
    next.push({ ...current, enabled: true, id });
    next.sort(
      (a, b) =>
        ONLINE_GATEWAYS.findIndex((g) => g.id === a.id) -
        ONLINE_GATEWAYS.findIndex((g) => g.id === b.id),
    );
    setForm({ ...form, gateway: id, defaultGateway: id, paymentGateways: next });
  }

  async function save() {
    if (!accessToken || !form) return;

    for (const meta of ONLINE_GATEWAYS) {
      const row = gatewayRow(form.paymentGateways, meta.id);
      if (!row.enabled) continue;
      const merchant = merchantDrafts[meta.id].trim();
      const hasMerchant = row.merchantIdSet || Boolean(merchant);
      if (!hasMerchant && !(meta.id === "zibal" && row.sandbox)) {
        toast.error(`کلید ${meta.title} را وارد کنید یا درگاه را غیرفعال کنید.`);
        return;
      }
      if (meta.id === "sep" && merchant && !/^\d{6,10}$/.test(merchant)) {
        toast.error("Terminal ID سامان باید عددی (معمولاً ۸ رقم) باشد.");
        return;
      }
      if (meta.id === "pasargad" && row.enabled) {
        const code = codeDrafts[meta.id].trim() || row.merchantCode?.trim() || "";
        const hasUsername = row.usernameSet || Boolean(usernameDrafts[meta.id].trim());
        const hasPassword = row.privateKeySet || Boolean(keyDrafts[meta.id].trim());
        if (merchant && !/^\d+$/.test(merchant)) {
          toast.error("Terminal Number پاسارگاد باید عددی باشد.");
          return;
        }
        if (!code) {
          toast.error("Merchant Code پاسارگاد را وارد کنید.");
          return;
        }
        if (!hasUsername) {
          toast.error("نام کاربری پاسارگاد را وارد کنید.");
          return;
        }
        if (!hasPassword) {
          toast.error("رمز عبور پاسارگاد را وارد کنید.");
          return;
        }
      }
      if (meta.id === "mellat" && row.enabled) {
        const username = codeDrafts[meta.id].trim() || row.merchantCode?.trim() || "";
        const hasPassword = row.privateKeySet || Boolean(keyDrafts[meta.id].trim());
        if (merchant && !/^\d+$/.test(merchant)) {
          toast.error("Terminal ID ملت باید عددی باشد.");
          return;
        }
        if (!username) {
          toast.error("نام کاربری به‌پرداخت ملت را وارد کنید.");
          return;
        }
        if (!hasPassword) {
          toast.error("رمز عبور به‌پرداخت ملت را وارد کنید.");
          return;
        }
      }
      if (meta.id === "irankish" && row.enabled) {
        const acceptor = codeDrafts[meta.id].trim() || row.merchantCode?.trim() || "";
        const hasPassword = row.privateKeySet || Boolean(keyDrafts[meta.id].trim());
        const hasPublicKey = row.publicKeySet || Boolean(publicKeyDrafts[meta.id].trim());
        if (merchant && !/^\d+$/.test(merchant)) {
          toast.error("Terminal ID ایران‌کیش باید عددی باشد.");
          return;
        }
        if (!acceptor) {
          toast.error("Acceptor ID ایران‌کیش را وارد کنید.");
          return;
        }
        if (acceptor && !/^\d+$/.test(acceptor)) {
          toast.error("Acceptor ID ایران‌کیش باید عددی باشد.");
          return;
        }
        if (!hasPassword) {
          toast.error("رمز عبور (Pass Phrase) ایران‌کیش را وارد کنید.");
          return;
        }
        if (!hasPublicKey) {
          toast.error("کلید عمومی RSA ایران‌کیش را وارد کنید.");
          return;
        }
      }
    }

    let resolvedDefault = form.gateway ?? "none";
    if (enabledCount > 0) {
      const defaultEnabled =
        resolvedDefault !== "none" &&
        gatewayRow(form.paymentGateways, resolvedDefault as OnlinePaymentGateway).enabled;
      if (!defaultEnabled) {
        const firstEnabled = (form.paymentGateways ?? []).find((row) => row.enabled)?.id;
        if (!firstEnabled) {
          toast.error("حداقل یک درگاه آنلاین را فعال کنید.");
          return;
        }
        resolvedDefault = firstEnabled;
      }
    } else {
      resolvedDefault = "none";
    }

    setSaving(true);
    try {
      const paymentGateways = ONLINE_GATEWAYS.map((meta) => {
        const row = gatewayRow(form.paymentGateways, meta.id);
        if (meta.id === "pasargad") {
          return {
            id: meta.id,
            enabled: row.enabled,
            sandbox: row.sandbox,
            merchantId: merchantDrafts[meta.id].trim() || undefined,
            merchantCode:
              codeDrafts[meta.id].trim() || row.merchantCode?.trim() || undefined,
            username: usernameDrafts[meta.id].trim() || undefined,
            privateKey: keyDrafts[meta.id].trim() || undefined,
            baseUrl:
              baseUrlDrafts[meta.id].trim() ||
              row.baseUrl?.trim() ||
              PASARGAD_BASE_URLS[0].value,
          };
        }
        if (meta.id === "mellat") {
          return {
            id: meta.id,
            enabled: row.enabled,
            sandbox: row.sandbox,
            merchantId: merchantDrafts[meta.id].trim() || undefined,
            merchantCode:
              codeDrafts[meta.id].trim() || row.merchantCode?.trim() || undefined,
            username:
              codeDrafts[meta.id].trim() || row.merchantCode?.trim() || undefined,
            privateKey: keyDrafts[meta.id].trim() || undefined,
          };
        }
        if (meta.id === "irankish") {
          return {
            id: meta.id,
            enabled: row.enabled,
            sandbox: false,
            merchantId: merchantDrafts[meta.id].trim() || undefined,
            merchantCode:
              codeDrafts[meta.id].trim() || row.merchantCode?.trim() || undefined,
            privateKey: keyDrafts[meta.id].trim() || undefined,
            publicKey: publicKeyDrafts[meta.id].trim() || undefined,
          };
        }
        return {
          id: meta.id,
          enabled: row.enabled,
          sandbox: row.sandbox,
          merchantId: merchantDrafts[meta.id].trim() || undefined,
        };
      });

      const saved = await updateOpsSettings(accessToken, {
        cashOnDelivery: form.cashOnDelivery,
        cardToCard: form.cardToCard,
        cardHolder: form.cardHolder,
        cardNumber: form.cardNumber,
        donateMessage: sanitizeSimpleHtml(form.donateMessage ?? ""),
        gateway: resolvedDefault,
        defaultGateway: resolvedDefault,
        paymentGateways,
      });
      setForm(saved);
      setMerchantDrafts(EMPTY_DRAFTS());
      setCodeDrafts(EMPTY_DRAFTS());
      setUsernameDrafts(EMPTY_DRAFTS());
      setKeyDrafts(EMPTY_DRAFTS());
      setBaseUrlDrafts(EMPTY_DRAFTS());
      setPublicKeyDrafts(EMPTY_DRAFTS());
      toast.success("تنظیمات پرداخت ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="پرداخت"
        description={
          loading
            ? "در حال بارگذاری…"
            : `چند درگاه هم‌زمان — درگاه پیش‌فرض برای کمک‌های آنلاین${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <Link href="/settings" className="btn-secondary !py-2 text-xs">
            تنظیمات سایت
          </Link>
        }
      />
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {form ? (
        <div className="space-y-4">
          <FormAccordion
            defaultOpenIds={["donate-message", "gateways"]}
            storageKey="dm-payments-settings-accordion"
          >
            <FormAccordionItem
              id="donate-message"
              title="پیام صفحه کمک"
              description="قبل از مبلغ در /donate نمایش داده می‌شود"
              icon={MessageSquareText}
            >
              <Field
                label="پیام معرفی کمک"
                htmlFor="donate-message-editor"
                hint="از نوار ابزار برای پررنگ، ایتالیک، فهرست و لینک استفاده کنید."
              >
                <SimpleHtmlEditor
                  id="donate-message-editor"
                  value={form.donateMessage ?? ""}
                  rows={8}
                  placeholder="حمایت شما صرف برنامه‌های فرهنگی و عام‌المنفعهٔ بنیاد می‌شود."
                  onChange={(donateMessage) =>
                    setForm({ ...form, donateMessage })
                  }
                />
              </Field>
              <p className="mt-3 text-xs text-ink-muted">
                اهداف قابل انتخاب در{" "}
                <Link
                  href="/donation-goals"
                  className="font-medium text-pine hover:underline"
                >
                  اهداف کمک
                </Link>{" "}
                تعریف می‌شوند.
              </p>
            </FormAccordionItem>

            <FormAccordionItem
              id="gateways"
              title="درگاه‌های آنلاین"
              description="هر درگاهی که فعال و پیکربندی شده باشد برای پرداخت آنلاین در دسترس است."
              icon={CreditCard}
            >
            <div className="grid gap-4 sm:grid-cols-2">
              {ONLINE_GATEWAYS.map((meta) => {
                const row = gatewayRow(form.paymentGateways, meta.id);
                const isDefault = form.gateway === meta.id;
                return (
                  <div
                    key={meta.id}
                    className={`rounded-2xl border p-3 transition sm:p-4 ${
                      row.enabled
                        ? "border-pine/30 bg-mint-soft/20"
                        : "border-ink/10 bg-surface"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <PaymentGatewayIcon gateway={meta.id} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-ink">{meta.title}</h3>
                            {isDefault && row.enabled ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-pine/10 px-2 py-0.5 text-[10px] font-medium text-pine">
                                <Star className="h-3 w-3" aria-hidden />
                                پیش‌فرض
                              </span>
                            ) : null}
                            {row.enabled ? (
                              <CheckCircle2 className="h-4 w-4 text-pine" aria-hidden />
                            ) : null}
                          </div>
                          <p className="mt-1 text-[11px] leading-5 text-ink-muted">{meta.hint}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Checkbox
                          id={`enabled-${meta.id}`}
                          label="فعال"
                          checked={row.enabled}
                          onChange={(e) => patchGateway(meta.id, { enabled: e.target.checked })}
                        />
                        <button
                          type="button"
                          disabled={!row.enabled}
                          onClick={() => setDefaultGateway(meta.id)}
                          className="rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-pine/30 hover:text-pine disabled:opacity-40"
                        >
                          پیش‌فرض
                        </button>
                      </div>
                    </div>

                    {row.enabled ? (
                      <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                        {meta.supportsSandbox ? (
                          <Checkbox
                            id={`sandbox-${meta.id}`}
                            label="حالت آزمایشی (sandbox)"
                            checked={row.sandbox}
                            onChange={(e) => patchGateway(meta.id, { sandbox: e.target.checked })}
                          />
                        ) : null}
                        <Field
                          label={meta.keyLabel}
                          hint={
                            row.merchantIdSet
                              ? `قبلاً ذخیره شده. برای جایگزینی ${meta.keyHint}`
                              : meta.keyHint
                          }
                          htmlFor={`mid-${meta.id}`}
                        >
                          <Input
                            id={`mid-${meta.id}`}
                            value={merchantDrafts[meta.id]}
                            dir="ltr"
                            className="text-start"
                            placeholder={row.merchantIdSet ? "••••••••" : ""}
                            icon={<KeyRound className="h-4 w-4" aria-hidden />}
                            onChange={(e) =>
                              setMerchantDrafts((current) => ({
                                ...current,
                                [meta.id]: e.target.value,
                              }))
                            }
                          />
                        </Field>
                        {meta.id === "pasargad" ? (
                          <>
                            <Field label="Merchant Code" htmlFor={`code-${meta.id}`}>
                              <Input
                                id={`code-${meta.id}`}
                                value={codeDrafts[meta.id] || row.merchantCode || ""}
                                dir="ltr"
                                className="text-start"
                                icon={<Hash className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setCodeDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field
                              label="نام کاربری"
                              hint={
                                row.usernameSet
                                  ? "قبلاً ذخیره شده. برای جایگزینی مقدار جدید وارد کنید."
                                  : "نام کاربری ارسال‌شده از pep.co"
                              }
                              htmlFor={`user-${meta.id}`}
                            >
                              <Input
                                id={`user-${meta.id}`}
                                value={usernameDrafts[meta.id]}
                                dir="ltr"
                                className="text-start"
                                placeholder={row.usernameSet ? "••••••••" : ""}
                                icon={<User className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setUsernameDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field
                              label="رمز عبور"
                              hint={
                                row.privateKeySet
                                  ? "قبلاً ذخیره شده. برای جایگزینی رمز جدید وارد کنید."
                                  : "رمز عبور درگاه درسا (به‌جای کلید خصوصی)"
                              }
                              htmlFor={`key-${meta.id}`}
                            >
                              <Input
                                id={`key-${meta.id}`}
                                type="password"
                                value={keyDrafts[meta.id]}
                                dir="ltr"
                                className="text-start"
                                placeholder={row.privateKeySet ? "••••••••" : ""}
                                icon={<KeyRound className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setKeyDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field
                              label="آدرس پایه (Base URL)"
                              hint="آدرس ترمینال در پیامک/ایمیل پیاده‌سازی (معمولاً dorsa1)."
                              htmlFor={`base-${meta.id}`}
                            >
                              <Select
                                id={`base-${meta.id}`}
                                value={
                                  baseUrlDrafts[meta.id] ||
                                  row.baseUrl ||
                                  PASARGAD_BASE_URLS[0].value
                                }
                                dir="ltr"
                                className="text-start"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setBaseUrlDrafts((current) => ({
                                    ...current,
                                    [meta.id]: value,
                                  }));
                                  patchGateway(meta.id, { baseUrl: value });
                                }}
                              >
                                {PASARGAD_BASE_URLS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                                {row.baseUrl &&
                                !PASARGAD_BASE_URLS.some((o) => o.value === row.baseUrl) ? (
                                  <option value={row.baseUrl}>{row.baseUrl}</option>
                                ) : null}
                              </Select>
                            </Field>
                          </>
                        ) : null}
                        {meta.id === "mellat" ? (
                          <>
                            <Field label="نام کاربری" htmlFor={`code-${meta.id}`}>
                              <Input
                                id={`code-${meta.id}`}
                                value={codeDrafts[meta.id] || row.merchantCode || ""}
                                dir="ltr"
                                className="text-start"
                                icon={<Hash className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setCodeDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field label="رمز عبور" htmlFor={`key-${meta.id}`}>
                              <Input
                                id={`key-${meta.id}`}
                                type="password"
                                value={keyDrafts[meta.id]}
                                dir="ltr"
                                className="text-start"
                                placeholder={row.privateKeySet ? "••••••••" : ""}
                                icon={<KeyRound className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setKeyDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                          </>
                        ) : null}
                        {meta.id === "irankish" ? (
                          <>
                            <Field
                              label="Acceptor ID"
                              hint="شماره پذیرنده ۱۵ رقمی از پنل ایران‌کیش."
                              htmlFor={`code-${meta.id}`}
                            >
                              <Input
                                id={`code-${meta.id}`}
                                value={codeDrafts[meta.id] || row.merchantCode || ""}
                                dir="ltr"
                                className="text-start"
                                icon={<Hash className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setCodeDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field
                              label="رمز عبور (Pass Phrase)"
                              hint={
                                row.privateKeySet
                                  ? "قبلاً ذخیره شده. برای جایگزینی رمز جدید وارد کنید."
                                  : "رمز/عبارت عبور ترمینال از ایران‌کیش."
                              }
                              htmlFor={`key-${meta.id}`}
                            >
                              <Input
                                id={`key-${meta.id}`}
                                type="password"
                                value={keyDrafts[meta.id]}
                                dir="ltr"
                                className="text-start"
                                placeholder={row.privateKeySet ? "••••••••" : ""}
                                icon={<KeyRound className="h-4 w-4" aria-hidden />}
                                onChange={(e) =>
                                  setKeyDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                            <Field
                              label="کلید عمومی RSA (PEM)"
                              hint={
                                row.publicKeySet
                                  ? "قبلاً ذخیره شده. برای جایگزینی کلید جدید را وارد کنید."
                                  : "کلید عمومی ارائه‌شده توسط ایران‌کیش."
                              }
                              htmlFor={`pubkey-${meta.id}`}
                            >
                              <Textarea
                                id={`pubkey-${meta.id}`}
                                value={publicKeyDrafts[meta.id]}
                                dir="ltr"
                                rows={5}
                                className="font-mono text-xs"
                                placeholder={
                                  row.publicKeySet
                                    ? "••••••••"
                                    : "-----BEGIN PUBLIC KEY-----"
                                }
                                onChange={(e) =>
                                  setPublicKeyDrafts((current) => ({
                                    ...current,
                                    [meta.id]: e.target.value,
                                  }))
                                }
                              />
                            </Field>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            </FormAccordionItem>
          </FormAccordion>

          <FormActions>
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => void save()}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
            </button>
          </FormActions>
        </div>
      ) : null}
    </div>
  );
}
