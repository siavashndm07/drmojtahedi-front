"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { sanitizeSimpleHtml } from "@drmojtahedi/shared";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  CreditCard,
  Heart,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { PaymentGatewayIcon } from "@/components/PaymentGatewayIcon";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";
import {
  getDonatePaymentOptions,
  startDonatePayment,
  type DonateGoalOption,
  type DonatePaymentOptions,
} from "@/lib/api/donate";
import { ApiError } from "@/lib/api/client";
import { isApiEnabled } from "@/lib/api/config";
import {
  DONATE_AMOUNT_PRESETS,
  DONATE_MESSAGE,
  DONATE_MIN_RIALS,
  DONATE_TARGETS,
  formatRials,
  formatToman,
} from "@/lib/mock/donations";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

type Step = "intro" | "amount" | "purpose" | "identity" | "pay" | "receipt";

type DonateFormProps = {
  mode?: "public" | "member";
};

const STEPS: { id: Step; label: string }[] = [
  { id: "intro", label: "پیام" },
  { id: "amount", label: "مبلغ" },
  { id: "purpose", label: "هدف" },
  { id: "identity", label: "هویت" },
  { id: "pay", label: "پرداخت" },
];

const FALLBACK_GOALS: DonateGoalOption[] = DONATE_TARGETS.map((t) => ({
  id: t.id,
  title: t.title,
  description: t.description,
}));

function formatCardNumber(value: string): string {
  const digits = toEnglishDigits(value).replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function DonateForm({ mode = "public" }: DonateFormProps) {
  const { user, addDonation } = useAuth();
  const { openLogin } = useAuthUi();

  const [step, setStep] = useState<Step>("intro");
  const [amount, setAmount] = useState(5_000_000);
  const [amountInput, setAmountInput] = useState(formatRials(5_000_000));
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [methodId, setMethodId] = useState<string | null>(null);
  const [gatewayId, setGatewayId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [awaitingAuth, setAwaitingAuth] = useState(false);
  const [options, setOptions] = useState<DonatePaymentOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<{
    amountRials: number;
    bankName: string;
    transactionId: string;
    targets: string[];
    method: string;
    cardNumber?: string;
    cardHolder?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setOptionsLoading(true);
      try {
        const data = await getDonatePaymentOptions();
        if (cancelled) return;
        setOptions(data);
        const firstMethod = data.methods[0]?.id ?? null;
        setMethodId(firstMethod);
        setGatewayId(data.defaultGateway ?? data.gateways[0]?.id ?? null);
        const goals =
          data.goals.length > 0
            ? data.goals
            : isApiEnabled()
              ? []
              : FALLBACK_GOALS;
        const preferred =
          goals.find((g) => g.id === "general")?.id ?? goals[0]?.id;
        if (preferred) setTargetIds([preferred]);
      } catch {
        if (!cancelled) {
          setOptions({
            methods: [],
            gateways: [],
            defaultGateway: null,
            cardToCard: { enabled: false, cardHolder: "", cardNumber: "" },
            minAmountRials: DONATE_MIN_RIALS,
            message: DONATE_MESSAGE,
            goals: FALLBACK_GOALS,
          });
          setTargetIds(["general"]);
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setFirstName((c) => c || user.firstName);
    setLastName((c) => c || user.lastName);
    setNationalId((c) => c || user.nationalId);
    setPhone((c) => c || user.phone);
    if (awaitingAuth && step === "identity") {
      setAwaitingAuth(false);
      toast.success("ورود موفق؛ می‌توانید پرداخت را ادامه دهید.");
      setStep("pay");
    }
  }, [user, awaitingAuth, step]);

  const goals: DonateGoalOption[] = useMemo(() => {
    if (options?.goals && options.goals.length > 0) return options.goals;
    if (!isApiEnabled()) return FALLBACK_GOALS;
    return [];
  }, [options]);

  const selectedTargets = useMemo(
    () => goals.filter((t) => targetIds.includes(t.id)),
    [goals, targetIds],
  );

  const donateMessage = (options?.message || "").trim() || DONATE_MESSAGE;

  const minAmount = options?.minAmountRials ?? DONATE_MIN_RIALS;
  const methods = options?.methods ?? [];
  const gateways = options?.gateways ?? [];
  const card = options?.cardToCard;
  const onlineSelected = methodId === "online";
  const cardSelected = methodId === "card_to_card";
  const canPay =
    Boolean(methodId) &&
    (cardSelected || (onlineSelected && Boolean(gatewayId))) &&
    !optionsLoading;

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const parseAmount = (raw: string) => {
    const digits = toEnglishDigits(raw).replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const goNext = () => {
    if (step === "intro") {
      setStep("amount");
      return;
    }
    if (step === "amount") {
      if (amount < minAmount) {
        toast.error(
          `حداقل مبلغ ${toPersianDigits(formatRials(minAmount))} ریال است.`,
        );
        return;
      }
      setStep("purpose");
      return;
    }
    if (step === "purpose") {
      if (goals.length === 0) {
        toast.error("هنوز هدف کمکی تعریف نشده است.");
        return;
      }
      if (targetIds.length === 0) {
        toast.error("حداقل یک هدف را انتخاب کنید.");
        return;
      }
      setStep("identity");
      return;
    }
    if (step === "identity") {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("نام و نام خانوادگی الزامی است.");
        return;
      }
      if (!/^\d{10}$/.test(toEnglishDigits(nationalId))) {
        toast.error("کد ملی باید ۱۰ رقم باشد.");
        return;
      }
      if (!/^09\d{9}$/.test(toEnglishDigits(phone))) {
        toast.error("شماره همراه معتبر (۰۹…) وارد کنید.");
        return;
      }
      if (!user) {
        setAwaitingAuth(true);
        openLogin();
        toast("برای ادامه با پیامک وارد شوید؛ پس از ورود به پرداخت می‌روید.");
        return;
      }
      setStep("pay");
    }
  };

  const goBack = () => {
    if (step === "amount") setStep("intro");
    else if (step === "purpose") setStep("amount");
    else if (step === "identity") setStep("purpose");
    else if (step === "pay") setStep("identity");
  };

  const handlePay = async () => {
    if (!user) {
      openLogin();
      toast.error("برای پرداخت ابتدا وارد شوید.");
      return;
    }
    if (!methodId) {
      toast.error("روش پرداخت را انتخاب کنید.");
      return;
    }
    if (onlineSelected && !gatewayId) {
      toast.error("درگاه بانکی را انتخاب کنید.");
      return;
    }
    if (!methods.length) {
      toast.error("در حال حاضر روش پرداختی فعال نیست. از تنظیمات ادمین فعال کنید.");
      return;
    }

    const gatewayLabel =
      gateways.find((g) => g.id === gatewayId)?.label ?? "درگاه آنلاین";
    const bankName = cardSelected
      ? "کارت‌به‌کارت"
      : gatewayLabel;
    const targets = selectedTargets.map((t) => t.title);

    setPaying(true);
    try {
      if (!isApiEnabled()) {
        await new Promise((r) => setTimeout(r, 500));
        const transactionId = `LOCAL-${Date.now().toString().slice(-8)}`;
        addDonation({
          dateLabel: new Date().toLocaleDateString("fa-IR"),
          timeLabel: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          amountRials: amount,
          transactionId,
          bankName,
          targets,
        });
        setReceipt({
          amountRials: amount,
          bankName,
          transactionId,
          targets,
          method: methodId,
          cardNumber: cardSelected ? card?.cardNumber : undefined,
          cardHolder: cardSelected ? card?.cardHolder : undefined,
        });
        setStep("receipt");
        return;
      }

      const result = await startDonatePayment({
        amount,
        method: methodId,
        gateway: onlineSelected ? gatewayId : null,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: toEnglishDigits(phone),
        nationalId: toEnglishDigits(nationalId),
        goals: targets,
      });

      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }

      const transactionId =
        result.transactionId || `DON-${result.donationId}`;
      addDonation({
        dateLabel: new Date().toLocaleDateString("fa-IR"),
        timeLabel: new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        amountRials: amount,
        transactionId,
        bankName,
        targets,
      });
      setReceipt({
        amountRials: amount,
        bankName,
        transactionId,
        targets,
        method: methodId,
        cardNumber: result.cardToCard?.cardNumber ?? card?.cardNumber,
        cardHolder: result.cardToCard?.cardHolder ?? card?.cardHolder,
      });
      setStep("receipt");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "شروع پرداخت ناموفق بود.",
      );
    } finally {
      setPaying(false);
    }
  };

  const copyCard = async () => {
    const number = receipt?.cardNumber || card?.cardNumber;
    if (!number) return;
    try {
      await navigator.clipboard.writeText(toEnglishDigits(number).replace(/\D/g, ""));
      setCopied(true);
      toast.success("شماره کارت کپی شد.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("کپی شماره کارت ممکن نشد.");
    }
  };

  const widthClass = mode === "member" ? "w-full" : "mx-auto max-w-2xl";

  if (step === "receipt" && receipt) {
    const isCard = receipt.method === "card_to_card";
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
        <h2 className="mt-4 text-2xl font-bold text-ink">
          {isCard ? "آماده واریز کارت‌به‌کارت" : "کمک شما ثبت شد"}
        </h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">
          {isCard
            ? "مبلغ را به کارت زیر واریز کنید؛ پس از تأیید مالی، وضعیت کمک به‌روزرسانی می‌شود."
            : "رسید در حساب شما ذخیره شد."}
        </p>
        <div className="mt-6 space-y-2 rounded-2xl bg-mint-soft/50 px-5 py-4 text-sm">
          <p className="text-3xl font-bold text-pine" dir="ltr">
            {toPersianDigits(formatRials(receipt.amountRials))}
            <span className="ms-2 text-sm font-medium text-ink-muted">ریال</span>
          </p>
          <p className="text-ink-muted">{receipt.bankName}</p>
          {isCard && receipt.cardNumber ? (
            <div className="space-y-1 pt-2">
              {receipt.cardHolder ? (
                <p className="text-xs text-ink-muted">{receipt.cardHolder}</p>
              ) : null}
              <p className="font-semibold tracking-wider text-ink" dir="ltr">
                {toPersianDigits(formatCardNumber(receipt.cardNumber))}
              </p>
              <button
                type="button"
                onClick={() => void copyCard()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-pine hover:underline"
              >
                <Copy className="size-3.5" aria-hidden />
                {copied ? "کپی شد" : "کپی شماره کارت"}
              </button>
            </div>
          ) : null}
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
              setStep("intro");
              setReceipt(null);
              setCopied(false);
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
        {step === "intro" ? (
          <div className="space-y-6">
            <header>
              <p className="inline-flex items-center gap-2 text-xs tracking-[0.14em] text-bronze">
                <Heart className="size-3.5" aria-hidden />
                کمک خیرخواهانه
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">پیام بنیاد</h2>
            </header>
            {optionsLoading ? (
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 className="size-4 animate-spin" />
                بارگذاری پیام…
              </p>
            ) : (
              <div className="rounded-2xl bg-gradient-to-l from-mint-soft/80 to-cream px-5 py-6">
                <div
                  className="text-base leading-8 text-ink md:text-lg [&_a]:font-medium [&_a]:text-pine [&_a]:underline [&_em]:italic [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-5"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeSimpleHtml(donateMessage),
                  }}
                />
              </div>
            )}
          </div>
        ) : null}

        {step === "amount" ? (
          <div className="space-y-6">
            <header>
              <h2 className="text-2xl font-bold text-ink">مبلغ کمک</h2>
              <p className="mt-2 text-sm text-ink-muted">
                مبلغ مورد نظر خود را به ریال وارد کنید.
              </p>
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
            {goals.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                هنوز هدف کمکی از پنل ادمین تعریف نشده است.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {goals.map((target) => {
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
                          <span className="font-semibold text-ink">
                            {target.title}
                          </span>
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
                        {target.description ? (
                          <span className="mt-2 text-xs leading-6 text-ink-muted">
                            {target.description}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
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
              <Field label="نام" value={firstName} onChange={setFirstName} />
              <Field label="نام خانوادگی" value={lastName} onChange={setLastName} />
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
                روش پرداخت فعال در تنظیمات ادمین و درگاه مرتبط را انتخاب کنید.
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

            {optionsLoading ? (
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 className="size-4 animate-spin" />
                بارگذاری روش‌های پرداخت…
              </p>
            ) : methods.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                هیچ روش پرداختی از پنل ادمین فعال نیست. از
                {" "}
                <span className="font-medium">تنظیمات ← پرداخت</span>
                {" "}
                درگاه یا کارت‌به‌کارت را فعال کنید.
              </p>
            ) : (
              <>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink">روش پرداخت</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {methods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setMethodId(method.id)}
                        className={cn(
                          "rounded-xl border px-4 py-4 text-start transition",
                          methodId === method.id
                            ? "border-pine bg-mint-soft/60"
                            : "border-ink/10 hover:border-pine/40",
                        )}
                      >
                        <span className="flex items-center gap-2 text-sm font-bold">
                          {method.id === "card_to_card" ? (
                            <CreditCard className="size-4 text-pine" aria-hidden />
                          ) : (
                            <ShieldCheck className="size-4 text-pine" aria-hidden />
                          )}
                          {method.label}
                        </span>
                        {method.description ? (
                          <span className="mt-1 block text-xs text-ink-muted">
                            {method.description}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>

                {onlineSelected ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-ink">
                      درگاه بانکی
                    </p>
                    {gateways.length === 0 ? (
                      <p className="text-sm text-ink-muted">
                        درگاه آنلاینی فعال و آماده نیست.
                      </p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {gateways.map((gateway) => (
                          <button
                            key={gateway.id}
                            type="button"
                            onClick={() => setGatewayId(gateway.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border px-4 py-4 text-start transition",
                              gatewayId === gateway.id
                                ? "border-pine bg-mint-soft/60"
                                : "border-ink/10 hover:border-pine/40",
                            )}
                          >
                            <PaymentGatewayIcon gateway={gateway.id} />
                            <span>
                              <span className="block text-sm font-bold">
                                {gateway.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-ink-muted">
                                {gateway.sandbox
                                  ? "حالت آزمایشی"
                                  : "هدایت به درگاه بانک"}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {cardSelected && card?.enabled ? (
                  <div className="rounded-xl border border-ink/10 bg-cream/60 px-4 py-4 text-sm">
                    <p className="font-medium text-ink">مشخصات کارت بنیاد</p>
                    {card.cardHolder ? (
                      <p className="mt-2 text-ink-muted">{card.cardHolder}</p>
                    ) : null}
                    <p
                      className="mt-1 font-semibold tracking-wider text-ink"
                      dir="ltr"
                    >
                      {toPersianDigits(formatCardNumber(card.cardNumber))}
                    </p>
                  </div>
                ) : null}
              </>
            )}

            <p className="flex items-start gap-2 text-xs leading-6 text-ink-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-pine" />
              {onlineSelected
                ? "پس از تأیید به درگاه بانک هدایت می‌شوید."
                : "پس از ثبت، مبلغ را کارت‌به‌کارت واریز کنید."}
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          {step !== "intro" ? (
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
              disabled={paying || !canPay}
              onClick={() => void handlePay()}
              className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
            >
              {paying ? <Loader2 className="size-4 animate-spin" /> : null}
              {onlineSelected ? "پرداخت و هدایت به بانک" : "ثبت و نمایش کارت"}
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
