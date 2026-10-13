"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  FormField,
  TextArea,
  TextBox,
} from "@/components/forms/FormPrimitives";
import { SelectListbox } from "@/components/forms/SelectListbox";
import { submitContribution } from "@/lib/api/engagement";
import { isApiEnabled } from "@/lib/api/config";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "drmojtahedi-contributions";

const TYPES = [
  { value: "memory", label: "خاطره / روایت" },
  { value: "photo", label: "عکس" },
  { value: "document", label: "سند" },
  { value: "book", label: "کتاب" },
  { value: "artifact", label: "اثر هنری" },
  { value: "other", label: "سایر" },
];

type FieldErrors = Partial<
  Record<"name" | "title" | "body" | "contact", string>
>;

export function ContributeForm() {
  const [type, setType] = useState("memory");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "این فیلد الزامی است.";
    if (!title.trim()) next.title = "این فیلد الزامی است.";
    if (!body.trim()) next.body = "این فیلد الزامی است.";
    if (!phone.trim() && !email.trim()) {
      next.contact = "حداقل یکی از تلفن یا ایمیل را وارد کنید.";
    }
    setFieldErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const payload = {
        type,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        title: title.trim(),
        body: body.trim(),
      };
      if (isApiEnabled()) {
        await submitContribution(payload);
      } else {
        const entry = { id: `${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
        const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]));
      }
      setDone(true);
    } catch {
      setSubmitError("ارسال ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-pine/20 bg-mint-soft/50 p-6 text-sm leading-8 text-ink-muted">
        <p className="flex items-center gap-2 font-semibold text-pine">
          <CheckCircle2 className="size-5" aria-hidden />
          درخواست شما ثبت شد
        </p>
        <p className="mt-3">
          {isApiEnabled()
            ? "پس از بررسی، در صورت نیاز با شما تماس گرفته می‌شود."
            : "در حالت seed، ارسال فقط روی دستگاه شما ذخیره می‌شود."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm md:p-8"
    >
      <SelectListbox
        label="نوع ارسال"
        value={type}
        onChange={setType}
        options={TYPES}
        placeholder="انتخاب کنید"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="contribute-name" label="نام و نام خانوادگی" error={fieldErrors.name}>
          <TextBox
            id="contribute-name"
            value={name}
            error={fieldErrors.name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
        </FormField>
        <FormField id="contribute-phone" label="تلفن" error={fieldErrors.contact}>
          <TextBox
            id="contribute-phone"
            value={phone}
            error={fieldErrors.contact}
            onChange={(e) => {
              setPhone(e.target.value);
              setFieldErrors((prev) => ({ ...prev, contact: undefined }));
            }}
            inputMode="tel"
            dir="ltr"
          />
        </FormField>
      </div>
      <FormField id="contribute-email" label="ایمیل" error={fieldErrors.contact && !phone.trim() ? fieldErrors.contact : null}>
        <TextBox
          id="contribute-email"
          type="email"
          value={email}
          error={fieldErrors.contact}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, contact: undefined }));
          }}
          dir="ltr"
        />
      </FormField>
      <FormField id="contribute-title" label="عنوان" error={fieldErrors.title}>
        <TextBox
          id="contribute-title"
          value={title}
          error={fieldErrors.title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((prev) => ({ ...prev, title: undefined }));
          }}
        />
      </FormField>
      <FormField id="contribute-body" label="شرح خاطره یا سند" error={fieldErrors.body}>
        <TextArea
          id="contribute-body"
          value={body}
          error={fieldErrors.body}
          onChange={(e) => {
            setBody(e.target.value);
            setFieldErrors((prev) => ({ ...prev, body: undefined }));
          }}
          className="min-h-36"
        />
      </FormField>
      <p className="text-xs leading-6 text-ink-muted">
        فایل پیوست در نسخه‌های بعدی فعال می‌شود. فعلاً شرح و اطلاعات تماس کافی است.
      </p>
      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60",
        )}
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        ارسال برای بررسی
      </button>
    </form>
  );
}
