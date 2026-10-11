"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";
import {
  DONATE_AMOUNT_PRESETS,
  DONATE_MESSAGE,
  DONATE_MIN_RIALS,
  DONATE_TARGETS,
  PAYMENT_BANKS,
  formatRials,
  formatToman,
} from "@/lib/mock/donations";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

type Step = "amount" | "purpose" | "identity" | "pay" | "receipt";

type DonateFormProps = {
  mode?: "public" | "member";
};

const STEPS: { id: Step; label: string }[] = [
  { id: "amount", label: "مبلغ" },
  { id: "purpose", label: "هدف" },
  { id: "identity", label: "هویت" },
  { id: "pay", label: "پرداخت" },
];

export function DonateForm({ mode = "public" }: DonateFormProps) {
  const { user, addDonation } = useAuth();
  const { openLogin } = useAuthUi();

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(5_000_000);
  const [amountInput, setAmountInput] = useState(formatRials(5_000_000));
  const [targetIds, setTargetIds] = useState<string[]>(["general"]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [awaitingAuth, setAwaitingAuth] = useState(false);
  const [receipt, setReceipt] = useState<{
    amountRials: number;
    bankName: string;
    transactionId: string;
    targets: string[];
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName((c) => c || user.firstName);
    setLastName((c) => c || user.lastName);
    setNationalId((c) => c || user.nationalId);
    setPhone((c) => c || user.phone);
    if (awaitingAuth && step === "identity") {
      setAwaitingAuth(false);
      setError(null);
      setStep("pay");
    }
  }, [user, awaitingAuth, step]);

  const selectedTargets = useMemo(
    () => DONATE_TARGETS.filter((t) => targetIds.includes(t.id)),
    [targetIds],
  );

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const parseAmount = (raw: string) => {
    const digits = toEnglishDigits(raw).replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const goNext = () => {
    setError(null);
    if (step === "amount") {
      if (amount < DONATE_MIN_RIALS) {
        setError(
          `حداقل مبلغ ${toPersianDigits(formatRials(DONATE_MIN_RIALS))} ریال است.`,
        );
        return;
      }
      setStep("purpose");
      return;
    }
    if (step === "purpose") {
      if (targetIds.length === 0) {
        setError("حداقل یک هدف را انتخاب کنید.");
        return;
      }
      setStep("identity");
      return;
    }
    if (step === "identity") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("نام و نام خانوادگی الزامی است.");
        return;
      }
      if (!/^\d{10}$/.test(toEnglishDigits(nationalId))) {
        setError("کد ملی باید ۱۰ رقم باشد.");
        return;
      }
      if (!/^09\d{9}$/.test(toEnglishDigits(phone))) {
        setError("شماره همراه معتبر (۰۹…) وارد کنید.");
        return;
      }
      if (!user) {
        setAwaitingAuth(true);
        openLogin();
        setError("برای ادامه با پیامک وارد شوید؛ پس از ورود به پرداخت می‌روید.");
        return;
      }
      setStep("pay");
    }
  };

  const goBack = () => {
    setError(null);
    if (step === "purpose") setStep("amount");
    else if (step === "identity") setStep("purpose");
    else if (step === "pay") setStep("identity");
  };

  const handlePay = async () => {
    setError(null);
    if (!user) {
      openLogin();
      setError("برای پرداخت ابتدا وارد شوید.");
      return;
    }
    if (!bankId) {
      setError("درگاه پرداخت را انتخاب کنید.");
      return;
    }
    const bank = PAYMENT_BANKS.find((b) => b.id === bankId);
    if (!bank) return;

    setPaying(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = new Date();
    const transactionId = `DEMO-${now.getTime().toString().slice(-8)}`;
    const targets = selectedTargets.map((t) => t.title);
    addDonation({
      dateLabel: now.toLocaleDateString("fa-IR"),
      timeLabel: now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amountRials: amount,
      transactionId,
      bankName: bank.name,
      targets,
    });
    setReceipt({
      amountRials: amount,
      bankName: bank.name,
      transactionId,
      targets,
    });
    setPaying(false);
    setStep("receipt");
  };

  const widthClass = mode === "member" ? "w-full" : "mx-auto max-w-2xl";

  if (step === "receipt" && receipt) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-ink/10 bg-surface p-6 text-center shadow-sm sm:p-8",
          mode === "member" ? "w-full" : "mx-auto max-w-lg",
        )}
      >
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-mint-soft text-pine">
          <Check className="size-7" strokeWidth={2} aria-hidden />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-ink">کمک شما ثبت شد</h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">
          اتصال درگاه واقعی در فاز بعدی است؛ این رسید آزمایشی در حساب شما ذخیره
          شد.
        </p>
        <div className="mt-6 space-y-2 rounded-2xl bg-mint-soft/50 px-5 py-4 text-sm">
          <p className="text-3xl font-bold text-pine" dir="ltr">
            {toPersianDigits(formatRials(receipt.amountRials))}
            <span className="ms-2 text-sm font-medium text-ink-muted">ریال</span>
          </p>
          <p className="text-ink-muted">{receipt.bankName}</p>
          <p className="text-xs text-ink-muted" dir="ltr">
            {receipt.transactionId}
          </p>
          <p className="pt-2 text-xs text-ink-muted">
            {receipt.targets.join(" · ")}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/account/donations"
            className="inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            سوابق کمک
          </Link>
          <button
            type="button"
            onClick={() => {
              setStep("amount");
              setReceipt(null);
              setBankId(null);
            }}
            className="inline-flex rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium"
          >
            کمک دیگر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={widthClass}>
      <ol className="mb-8 flex items-center justify-between gap-1">
        {STEPS.map((item, index) => {
          const done = stepIndex > index;
          const current = step === item.id;
          return (
            <li key={item.id} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold transition",
                  done || current
                    ? "bg-pine text-white"
                    : "bg-ink/10 text-ink-muted",
                )}
              >
                {done ? <Check className="size-4" /> : toPersianDigits(index + 1)}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium sm:text-xs",
                  current ? "text-pine" : "text-ink-muted",
                )}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm sm:p-8">
        {step === "amount" ? (
          <div className="space-y-6">
            <header>
              <p className="inline-flex items-center gap-2 text-xs tracking-[0.14em] text-bronze">
                <Heart className="size-3.5" aria-hidden />
                کمک خیرخواهانه
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">مبلغ کمک</h2>
              <p className="mt-2 text-sm text-ink-muted">{DONATE_MESSAGE}</p>
            </header>
            <div className="rounded-2xl bg-gradient-to-l from-mint-soft/80 to-cream px-4 py-8 text-center">
              <input
                value={toPersianDigits(amountInput)}
                onChange={(event) => {
                  const next = parseAmount(event.target.value);
                  setAmount(next);
                  setAmountInput(next ? formatRials(next) : "");
                }}
                className="w-full bg-transparent text-center text-4xl font-bold text-pine outline-none md:text-5xl"
                inputMode="numeric"
                aria-label="مبلغ به ریال"
              />
              <p className="mt-2 text-sm text-ink-muted">ریال</p>
              {amount > 0 ? (
                <p className="mt-1 text-xs text-ink-muted">
                  حدود {toPersianDigits(formatToman(amount))} تومان
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {DONATE_AMOUNT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    setAmountInput(formatRials(preset));
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                    amount === preset
                      ? "border-pine bg-pine text-white"
                      : "border-ink/10 bg-cream hover:border-pine/40",
                  )}
                >
                  {toPersianDigits(formatRials(preset))}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === "purpose" ? (
          <div className="space-y-5">
            <header>
              <h2 className="text-2xl font-bold text-ink">هدف کمک</h2>
              <p className="mt-2 text-sm text-ink-muted">
                می‌توانید چند هدف را همزمان انتخاب کنید.
              </p>
            </header>
            <ul className="grid gap-3 sm:grid-cols-2">
              {DONATE_TARGETS.map((target) => {
                const checked = targetIds.includes(target.id);
                return (
                  <li key={target.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setTargetIds((prev) =>
                          prev.includes(target.id)
                            ? prev.filter((id) => id !== target.id)
                            : [...prev, target.id],
                        )
                      }
                      className={cn(
                        "flex h-full w-full flex-col rounded-2xl border px-4 py-4 text-start transition",
                        checked
                          ? "border-pine bg-mint-soft/70"
                          : "border-ink/10 hover:border-pine/35",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ink">{target.title}</span>
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border",
                            checked
                              ? "border-pine bg-pine text-white"
                              : "border-ink/20",
                          )}
                        >
                          {checked ? <Check className="size-3" /> : null}
                        </span>
                      </span>
                      <span className="mt-2 text-xs leading-6 text-ink-muted">
                        {target.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {step === "identity" ? (
          <div className="space-y-5">
            <header>
              <h2 className="text-2xl font-bold text-ink">اطلاعات اهداکننده</h2>
              <p className="mt-2 text-sm text-ink-muted">
                {user
                  ? "در صورت نیاز اطلاعات را اصلاح کنید."
                  : "پس از تأیید هویت، با پیامک وارد می‌شوید."}
              </p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="نام"
                value={firstName}
                onChange={setFirstName}
              />
              <Field
                label="نام خانوادگی"
                value={lastName}
                onChange={setLastName}
              />
              <Field
                label="کد ملی"
                value={toPersianDigits(nationalId)}
                onChange={(v) =>
                  setNationalId(toEnglishDigits(v).replace(/\D/g, "").slice(0, 10))
                }
                inputMode="numeric"
              />
              <Field
                label="شماره همراه"
                value={toPersianDigits(phone)}
                onChange={(v) =>
                  setPhone(toEnglishDigits(v).replace(/\D/g, "").slice(0, 11))
                }
                inputMode="numeric"
                disabled={Boolean(user)}
              />
            </div>
          </div>
        ) : null}

        {step === "pay" ? (
          <div className="space-y-5">
            <header>
              <h2 className="text-2xl font-bold text-ink">تأیید و پرداخت</h2>
              <p className="mt-2 text-sm text-ink-muted">
                خلاصه را بررسی کنید و درگاه را انتخاب کنید.
              </p>
            </header>
            <div className="rounded-2xl bg-cream/80 px-5 py-4 text-sm">
              <div className="flex justify-between gap-3 border-b border-ink/8 py-2">
                <span className="text-ink-muted">مبلغ</span>
                <span className="font-bold text-pine" dir="ltr">
                  {toPersianDigits(formatRials(amount))} ریال
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-ink/8 py-2">
                <span className="text-ink-muted">اهداکننده</span>
                <span className="font-medium text-ink">
                  {[firstName, lastName].filter(Boolean).join(" ")}
                </span>
              </div>
              <div className="py-2">
                <span className="text-ink-muted">اهداف</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedTargets.map((t) => (
                    <span
                      key={t.id}
                      className="rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-medium text-pine"
                    >
                      {t.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setBankId(bank.id)}
                  className={cn(
                    "rounded-xl border px-4 py-4 text-start transition",
                    bankId === bank.id
                      ? "border-pine bg-mint-soft/60"
                      : "border-ink/10 hover:border-pine/40",
                  )}
                >
                  <span className="block text-sm font-bold">{bank.name}</span>
                  <span className="mt-1 block text-xs text-ink-muted">
                    {bank.description}
                  </span>
                </button>
              ))}
            </div>
            <p className="flex items-start gap-2 text-xs leading-6 text-ink-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-pine" />
              پرداخت آزمایشی است و مبلغ واقعی کسر نمی‌شود.
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex gap-3">
          {step !== "amount" ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink/10 px-4 py-3 text-sm font-medium hover:border-pine/40"
            >
              <ArrowRight className="size-4" aria-hidden />
              بازگشت
            </button>
          ) : null}
          {step === "pay" ? (
            <button
              type="button"
              disabled={paying || !bankId}
              onClick={() => void handlePay()}
              className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
            >
              {paying ? <Loader2 className="size-4 animate-spin" /> : null}
              تأیید پرداخت
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-semibold text-white hover:bg-pine-dark"
            >
              ادامه
              <ArrowLeft className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {mode === "public" && step !== "receipt" ? (
        <p className="mt-4 text-center text-xs text-ink-muted">
          عضو هستید؟{" "}
          <Link href="/account" className="font-medium text-pine hover:underline">
            ورود به حساب
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "numeric" | "text";
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        className="mt-2 w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20 disabled:opacity-60"
      />
    </div>
  );
}
