"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bot, Cpu, Loader2, Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SettingsListbox, {
  type SettingsListboxOption,
} from "@/components/SettingsListbox";
import {
  Checkbox,
  Field,
  FormActions,
  FormSection,
  Input,
  PasswordInput,
  Textarea,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  getOpsSettings,
  testAiAssistant,
  updateOpsSettings,
  type AiProvider,
  type OpsSettings,
} from "@/lib/api/settings";

const PROVIDER_OPTIONS: SettingsListboxOption<AiProvider>[] = [
  {
    value: "openai",
    label: "OpenAI (GPT)",
    hint: "مدل‌های GPT از OpenAI",
    Icon: Sparkles,
  },
  {
    value: "grok",
    label: "Grok (xAI)",
    hint: "مدل‌های Grok از xAI",
    Icon: Bot,
  },
];

const OPENAI_MODELS: SettingsListboxOption<string>[] = [
  {
    value: "gpt-4o-mini",
    label: "GPT-4o mini",
    hint: "سریع و مناسب سایت",
    Icon: Cpu,
  },
  {
    value: "gpt-4o",
    label: "GPT-4o",
    hint: "کیفیت بالاتر",
    Icon: Cpu,
  },
  {
    value: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    hint: "نسخه جدید‌تر، متعادل",
    Icon: Cpu,
  },
];

const GROK_MODELS: SettingsListboxOption<string>[] = [
  {
    value: "grok-2-latest",
    label: "Grok 2 Latest",
    hint: "پیش‌فرض پیشنهادی",
    Icon: Cpu,
  },
  {
    value: "grok-2",
    label: "Grok 2",
    hint: "نسخه پایدار",
    Icon: Cpu,
  },
];

function defaultModelFor(provider: AiProvider): string {
  return provider === "grok" ? "grok-2-latest" : "gpt-4o-mini";
}

export default function AiAssistantSettingsClient() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<OpsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getOpsSettings(accessToken);
        if (!cancelled) setForm(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "بارگذاری ناموفق");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  function patch<K extends keyof OpsSettings>(key: K, value: OpsSettings[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  const modelOptions = useMemo(() => {
    if (!form) return OPENAI_MODELS;
    const provider = form.aiProvider ?? "openai";
    const base = provider === "grok" ? GROK_MODELS : OPENAI_MODELS;
    const current = (form.aiModel ?? "").trim();
    if (current && !base.some((item) => item.value === current)) {
      return [
        {
          value: current,
          label: current,
          hint: "مدل ذخیره‌شده",
          Icon: Cpu,
        },
        ...base,
      ];
    }
    return base;
  }, [form]);

  async function save() {
    if (!accessToken || !form) return;
    setSaving(true);
    try {
      const updated = await updateOpsSettings(accessToken, {
        aiEnabled: form.aiEnabled,
        aiProvider: form.aiProvider,
        aiModel: (form.aiModel ?? "").trim(),
        aiBaseUrl: (form.aiBaseUrl ?? "").trim(),
        aiWelcomeMessage: (form.aiWelcomeMessage ?? "").trim(),
        aiSystemExtra: (form.aiSystemExtra ?? "").trim(),
        ...(apiKey.trim() ? { aiApiKey: apiKey.trim() } : {}),
      });
      setForm(updated);
      setApiKey("");
      toast.success("تنظیمات دستیار ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!accessToken || !form) return;
    setTesting(true);
    try {
      const result = await testAiAssistant(accessToken, {
        provider: form.aiProvider,
        model: (form.aiModel ?? "").trim() || undefined,
        baseUrl: (form.aiBaseUrl ?? "").trim() || undefined,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
      });
      toast.success(result.detail || "اتصال موفق");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تست ناموفق");
    } finally {
      setTesting(false);
    }
  }

  if (loading || !form) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        در حال بارگذاری…
      </div>
    );
  }

  const provider = form.aiProvider ?? "openai";

  return (
    <div className="space-y-6">
      <PageHeader
        title="دستیار هوشمند"
        description="پاسخ به سوالات بازدیدکنندگان فقط در چارچوب بنیاد، با OpenAI یا Grok. کلید API فقط روی سرور می‌ماند."
      />

      <FormSection
        title="نمایش در سایت"
        description="به‌صورت پیش‌فرض خاموش است. حتی با کلید API ذخیره‌شده، تا وقتی این گزینه روشن نباشد ویجت در سایت دیده نمی‌شود."
      >
        <Checkbox
          id="ai-enabled"
          label="نمایش دستیار هوشمند در سایت"
          description={
            form.aiEnabled
              ? form.aiApiKeySet
                ? "وضعیت: ویجت در سایت دیده می‌شود و پاسخ‌ها از مدل انتخاب‌شده می‌آید."
                : "وضعیت: ویجت در سایت دیده می‌شود. تا ذخیرهٔ کلید API، راهنمای صفحات سایت پاسخ می‌دهد."
              : "وضعیت: ویجت در سایت مخفی است."
          }
          checked={Boolean(form.aiEnabled)}
          onChange={(e) => patch("aiEnabled", e.target.checked)}
        />
      </FormSection>

      <FormSection title="ارائه‌دهنده" description="در هر زمان فقط یک ارائه‌دهنده فعال است.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Provider" htmlFor="ai-provider">
            <SettingsListbox
              id="ai-provider"
              value={provider}
              options={PROVIDER_OPTIONS}
              onChange={(next) => {
                patch("aiProvider", next);
                const presets = next === "grok" ? GROK_MODELS : OPENAI_MODELS;
                const current = (form.aiModel ?? "").trim();
                if (!current || !presets.some((item) => item.value === current)) {
                  patch("aiModel", defaultModelFor(next));
                }
              }}
            />
          </Field>
          <Field
            label="Model"
            htmlFor="ai-model"
            hint={
              provider === "grok" ? "پیش‌فرض: grok-2-latest" : "پیش‌فرض: gpt-4o-mini"
            }
          >
            <SettingsListbox
              id="ai-model"
              value={(form.aiModel ?? "").trim() || defaultModelFor(provider)}
              options={modelOptions}
              onChange={(next) => patch("aiModel", next)}
            />
          </Field>
          <Field
            label="Base URL (اختیاری)"
            hint="خالی = پیش‌فرض ارائه‌دهنده"
            className="sm:col-span-2"
          >
            <Input
              dir="ltr"
              className="font-mono text-sm"
              value={form.aiBaseUrl ?? ""}
              onChange={(e) => patch("aiBaseUrl", e.target.value)}
              placeholder={
                provider === "grok"
                  ? "https://api.x.ai/v1"
                  : "https://api.openai.com/v1"
              }
            />
          </Field>
          <Field
            label="API Key"
            hint={
              form.aiApiKeySet
                ? "قبلاً ذخیره شده — برای تغییر مقدار جدید وارد کنید"
                : "کلید رایگان/توکن ارائه‌دهنده"
            }
            className="sm:col-span-2"
          >
            <PasswordInput
              dir="ltr"
              className="font-mono text-sm"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={form.aiApiKeySet ? "••••••••" : ""}
              autoComplete="off"
            />
          </Field>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="btn-secondary !py-2 text-xs"
            disabled={testing || saving}
            onClick={() => void handleTest()}
          >
            {testing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Bot className="h-3.5 w-3.5" aria-hidden />
            )}
            تست اتصال
          </button>
        </div>
      </FormSection>

      <FormSection title="پیام‌ها" description="خوش‌آمدگویی ویجت و یادداشت‌های اضافه برای پرامپت سیستم.">
        <div className="grid gap-4">
          <Field label="پیام خوش‌آمد">
            <Input
              value={form.aiWelcomeMessage ?? ""}
              onChange={(e) => patch("aiWelcomeMessage", e.target.value)}
            />
          </Field>
          <Field
            label="یادداشت ادمین (اختیاری)"
            hint="مثلاً تأکید روی پروژه‌های جاری یا نحوه کمک مالی"
          >
            <Textarea
              rows={4}
              value={form.aiSystemExtra ?? ""}
              onChange={(e) => patch("aiSystemExtra", e.target.value)}
            />
          </Field>
        </div>
      </FormSection>

      <FormActions>
        <button
          type="button"
          className="btn-primary"
          disabled={saving || testing}
          onClick={() => void save()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          ذخیره تنظیمات
        </button>
      </FormActions>
    </div>
  );
}
