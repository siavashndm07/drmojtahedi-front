"use client";

import { useEffect, useState } from "react";
import { OptionPills } from "@/components/forms/OptionPills";
import { SelectListbox } from "@/components/forms/SelectListbox";
import { useAuth } from "@/lib/auth";
import {
  HOW_MET_OPTIONS,
  normalizeHowMetValue,
  type HowMetValue,
} from "@/lib/howMet";
import {
  EDUCATION_OPTIONS,
  normalizeEducationValue,
} from "@/lib/mock/education";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";

export default function ProfileClient() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: "",
    education: "",
    description: "",
    howMet: "" as HowMetValue | "",
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
      howMet: normalizeHowMetValue(user.howMet),
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
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = {
            firstName: form.firstName.trim() ? undefined : "این فیلد الزامی است.",
            lastName: form.lastName.trim() ? undefined : "این فیلد الزامی است.",
            email: !form.email.trim()
              ? "این فیلد الزامی است."
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
                ? "ایمیل معتبر وارد کنید."
                : undefined,
          };
          setFieldErrors(next);
          if (next.firstName || next.lastName || next.email) return;
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
            error={fieldErrors.firstName}
            onChange={(firstName) => {
              setForm((f) => ({ ...f, firstName }));
              setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
            }}
          />
          <Field
            label="نام خانوادگی"
            value={form.lastName}
            error={fieldErrors.lastName}
            onChange={(lastName) => {
              setForm((f) => ({ ...f, lastName }));
              setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
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
            error={fieldErrors.email}
            onChange={(email) => {
              setForm((f) => ({ ...f, email }));
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
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
        </div>
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
        <OptionPills
          label="نحوه آشنایی با دکتر مجتهدی"
          value={form.howMet}
          options={HOW_MET_OPTIONS}
          onChange={(howMet) => setForm((f) => ({ ...f, howMet }))}
          columns={2}
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
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl border bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 ${
          error
            ? "border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
            : "border-ink/10 focus:border-pine/40 focus:ring-pine/20"
        }`}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
