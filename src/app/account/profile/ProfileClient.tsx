"use client";

import { useEffect, useState } from "react";
import { SelectListbox } from "@/components/forms/SelectListbox";
import { useAuth } from "@/lib/auth";
import {
  EDUCATION_OPTIONS,
  normalizeEducationValue,
} from "@/lib/mock/education";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";

export default function ProfileClient() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: "",
    education: "",
    description: "",
    howMet: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      nationalId: user.nationalId,
      email: user.email,
      education: normalizeEducationValue(user.education),
      description: user.description,
      howMet: user.howMet,
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-2xl text-ink">پروفایل</h1>
        <p className="mt-2 text-sm text-ink-muted">
          اطلاعات فردی برای عضویت و ثبت کمک‌های خیرخواهانه.
        </p>
      </div>

      <form
        className="w-full space-y-4 rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void updateProfile({
            ...form,
            nationalId: toEnglishDigits(form.nationalId).replace(/\D/g, ""),
          }).then(() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2500);
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="نام"
            value={form.firstName}
            onChange={(firstName) => setForm((f) => ({ ...f, firstName }))}
          />
          <Field
            label="نام خانوادگی"
            value={form.lastName}
            onChange={(lastName) => setForm((f) => ({ ...f, lastName }))}
          />
        </div>
        <Field
          label="کد ملی"
          value={toPersianDigits(form.nationalId)}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              nationalId: toEnglishDigits(v).replace(/\D/g, "").slice(0, 10),
            }))
          }
        />
        <Field
          label="ایمیل"
          value={form.email}
          onChange={(email) => setForm((f) => ({ ...f, email }))}
          type="email"
        />
        <Field
          label="شماره همراه"
          value={toPersianDigits(user.phone)}
          onChange={() => undefined}
          disabled
        />
        <SelectListbox
          id="profile-education"
          label="تحصیلات"
          value={form.education}
          onChange={(education) => setForm((f) => ({ ...f, education }))}
          options={EDUCATION_OPTIONS}
          placeholder="سطح تحصیلات را انتخاب کنید"
        />
        <div>
          <label className="text-sm font-medium text-ink">توضیحات</label>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((f) => ({ ...f, description: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
          />
        </div>
        <Field
          label="نحوه آشنایی با دکتر مجتهدی"
          value={form.howMet}
          onChange={(howMet) => setForm((f) => ({ ...f, howMet }))}
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark sm:w-auto"
        >
          ذخیره تغییرات
        </button>
        {saved ? (
          <p className="text-sm text-pine">اطلاعات ذخیره شد.</p>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20 disabled:opacity-60"
      />
    </div>
  );
}
