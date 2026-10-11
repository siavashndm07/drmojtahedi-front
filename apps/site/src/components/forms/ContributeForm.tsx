"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SelectListbox } from "@/components/forms/SelectListbox";

const STORAGE_KEY = "drmojtahedi-contributions";

const TYPES = [
  { value: "memory", label: "خاطره / روایت" },
  { value: "photo", label: "عکس" },
  { value: "document", label: "سند" },
  { value: "book", label: "کتاب" },
  { value: "artifact", label: "اثر هنری" },
  { value: "other", label: "سایر" },
];

export function ContributeForm() {
  const [type, setType] = useState("memory");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim() || !title.trim() || !body.trim()) {
      setError("نام، عنوان و توضیح الزامی است.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("حداقل یکی از تلفن یا ایمیل را وارد کنید.");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const entry = {
        id: `${Date.now()}`,
        type,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]));
      setDone(true);
    } catch {
      setError("ارسال آزمایشی ناموفق بود.");
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
          در این نسخهٔ آزمایشی، ارسال فقط روی دستگاه شما ذخیره می‌شود. پس از
          راه‌اندازی پنل ادمین، بررسی و تماس از سوی بنیاد انجام خواهد شد.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-ink/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:border-pine/40 dark:bg-ink/5";

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm md:p-8">
      <SelectListbox
        label="نوع ارسال"
        value={type}
        onChange={setType}
        options={TYPES}
        placeholder="انتخاب کنید"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">نام و نام خانوادگی</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">تلفن</span>
          <input
            className={field}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            dir="ltr"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">ایمیل</span>
        <input
          type="email"
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">عنوان</span>
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">شرح خاطره یا سند</span>
        <textarea
          className={`${field} min-h-36 resize-y`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </label>
      <p className="text-xs leading-6 text-ink-muted">
        فایل پیوست پس از اتصال ادمین فعال می‌شود. فعلاً شرح و اطلاعات تماس کافی است.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        ارسال برای بررسی
      </button>
    </form>
  );
}
