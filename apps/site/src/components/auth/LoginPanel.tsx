"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, Loader2, Phone, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  DEMO_OTP,
  isValidIranMobile,
  sendLoginOtp,
  useAuth,
  verifyLoginOtp,
} from "@/lib/auth";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";

export type LoginPanelProps = {
  onClose?: () => void;
  onLoginSuccess?: (phone: string) => void;
  showCloseButton?: boolean;
};

type Step = "phone" | "otp";

const OTP_LENGTH = 6;

export function LoginPanel({
  onClose,
  onLoginSuccess,
  showCloseButton = !!onClose,
}: LoginPanelProps) {
  const { login } = useAuth();
  const reduceMotion = useReducedMotion();
  const isPageMode = !showCloseButton;
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(120);
  const [otpInvalid, setOtpInvalid] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiresAtRef = useRef<number | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const stepMotion = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  useEffect(() => {
    if (!onClose) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (step !== "otp") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setTimer(120);
    setOtpInvalid(false);
    expiresAtRef.current = Date.now() + 120_000;

    const focusTimeout = setTimeout(() => otpRefs.current[0]?.focus(), 120);

    const tick = () => {
      if (!expiresAtRef.current) return;
      const remaining = Math.max(
        0,
        Math.ceil((expiresAtRef.current - Date.now()) / 1000),
      );
      setTimer(remaining);
      if (remaining === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        toast.error("کد منقضی شده است. لطفا دوباره ارسال کنید.");
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      clearTimeout(focusTimeout);
    };
  }, [step]);

  const handleSendOtp = useCallback(async () => {
    setOtpInvalid(false);
    if (!isValidIranMobile(phone)) {
      toast.error("لطفا شماره موبایل معتبر (با ۰۹) وارد کنید.");
      return;
    }

    setLoadingSend(true);
    const res = await sendLoginOtp(phone);
    setLoadingSend(false);

    if (res.success) {
      setOtpCode("");
      setOtpInvalid(false);
      setStep("otp");
      toast.success("کد تأیید ارسال شد.");
    } else {
      toast.error(res.message || "ارسال کد با خطا مواجه شد.");
    }
  }, [phone]);

  const handleVerifyOtp = useCallback(async () => {
    setOtpInvalid(false);
    if (otpCode.length !== OTP_LENGTH) {
      toast.error("کد باید ۶ رقم باشد.");
      return;
    }
    if (timer === 0) {
      toast.error("کد منقضی شده است. لطفا دوباره ارسال کنید.");
      return;
    }

    setLoadingVerify(true);
    const res = await verifyLoginOtp(phone, otpCode);
    setLoadingVerify(false);

    if (res.success) {
      login(
        phone,
        res.access ? { access: res.access, refresh: res.refresh } : undefined,
        res.user,
      );
      toast.success("ورود موفق.");
      onLoginSuccess?.(phone);
      onClose?.();
      setStep("phone");
      setPhone("");
      setOtpCode("");
      setOtpInvalid(false);
    } else {
      toast.error(res.message || "اعتبارسنجی کد موفق نبود.");
      setOtpInvalid(true);
      setOtpCode("");
      queueMicrotask(() => otpRefs.current[0]?.focus());
    }
  }, [otpCode, timer, phone, login, onClose, onLoginSuccess]);

  useEffect(() => {
    if (
      step === "otp" &&
      otpCode.length === OTP_LENGTH &&
      timer > 0 &&
      !loadingVerify
    ) {
      void handleVerifyOtp();
    }
  }, [otpCode, timer, loadingVerify, step, handleVerifyOtp]);

  const focusOtp = (index: number) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    otpRefs.current[clamped]?.focus();
    otpRefs.current[clamped]?.select();
  };

  const applyOtpValue = (value: string, startIndex = 0) => {
    const digits = toEnglishDigits(value).replace(/\D/g, "");
    if (!digits) return;

    const merged =
      otpCode.slice(0, startIndex) +
      digits +
      otpCode.slice(startIndex + digits.length);
    const code = toEnglishDigits(merged).replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtpCode(code);
    focusOtp(Math.min(startIndex + digits.length, OTP_LENGTH - 1));
  };

  const handleOtpDigitChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = toEnglishDigits(event.target.value).replace(/\D/g, "");
    if (!raw) {
      setOtpCode(otpCode.slice(0, index) + otpCode.slice(index + 1));
      return;
    }
    applyOtpValue(raw, index);
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (otpCode[index]) {
        setOtpCode(otpCode.slice(0, index) + otpCode.slice(index + 1));
        focusOtp(index);
      } else if (index > 0) {
        setOtpCode(otpCode.slice(0, index - 1) + otpCode.slice(index));
        focusOtp(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusOtp(index + 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusOtp(index - 1);
      return;
    }

    if (event.key === "Tab" || event.metaKey || event.ctrlKey) return;
    const key = toEnglishDigits(event.key);
    if (key.length === 1 && !/^\d$/.test(key)) event.preventDefault();
  };

  const handleOtpPaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    applyOtpValue(event.clipboardData.getData("text"), index);
  };

  const otpDisabled = loadingVerify || timer === 0;

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden ${
        isPageMode ? "max-w-none bg-transparent" : "max-w-md bg-surface"
      }`}
      dir="rtl"
    >
      {showCloseButton && onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute start-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-cream text-ink-muted transition hover:bg-mint-soft hover:text-ink"
          aria-label="بستن"
        >
          <X className="size-4" />
        </button>
      ) : null}

      {!isPageMode ? (
        <div className="px-6 pb-2 pt-8 text-center">
          {step === "phone" ? (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-ink sm:text-xl">
                ورود یا ثبت‌نام
              </h2>
              <p className="text-sm leading-7 text-ink-muted">
                شماره موبایل خود را وارد کنید؛ کد تأیید با پیامک ارسال می‌شود.
              </p>
              <p className="text-xs leading-6 text-ink-muted/90">
                اگر حساب نداشته باشید، با همان شماره ساخته می‌شود.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={isPageMode ? "px-0 pb-2 pt-0" : "px-6 pb-8 pt-2"}>
        <AnimatePresence mode="wait" initial={false}>
          {step === "phone" ? (
            <motion.form
              key="phone"
              className="space-y-5"
              {...stepMotion}
              onSubmit={(event) => {
                event.preventDefault();
                if (!loadingSend && phone) void handleSendOtp();
              }}
            >
              <div>
                <label htmlFor="login-phone" className="text-sm font-medium text-ink">
                  شماره موبایل
                </label>
                <div className="relative mt-2">
                  <Phone className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="login-phone"
                    type="tel"
                    value={toPersianDigits(phone)}
                    onChange={(event) => {
                      const digits = toEnglishDigits(event.target.value)
                        .replace(/\D/g, "")
                        .slice(0, 11);
                      setPhone(digits);
                    }}
                    placeholder={toPersianDigits("09123456789")}
                    className="w-full rounded-xl border border-ink/10 bg-paper py-3 pe-4 ps-10 text-center text-lg focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
                    disabled={loadingSend}
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <p className="rounded-xl bg-mint-soft/80 px-3 py-2 text-xs leading-6 text-ink-muted">
                نسخه نمایشی: پس از ارسال، کد{" "}
                <span className="font-semibold text-pine" dir="ltr">
                  {toPersianDigits(DEMO_OTP)}
                </span>{" "}
                را وارد کنید.
              </p>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loadingSend || !phone}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
                >
                  {loadingSend ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Phone className="size-4" />
                      ارسال کد
                    </>
                  )}
                </button>
                {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loadingSend}
                    className="flex-1 rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm font-medium hover:border-pine/40 disabled:opacity-50"
                  >
                    انصراف
                  </button>
                ) : null}
              </div>
            </motion.form>
          ) : null}

          {step === "otp" ? (
            <motion.div key="otp" className="space-y-5" {...stepMotion}>
              <div className="text-center">
                <p className="text-sm text-ink-muted">کد ۶ رقمی ارسال‌شده به</p>
                <p className="mt-1 text-lg font-semibold text-pine" dir="ltr">
                  {toPersianDigits(phone)}
                </p>
              </div>

              <div>
                <p className="mb-3 text-center text-sm font-medium text-ink">
                  کد تأیید
                </p>
                <div
                  className="flex justify-center gap-3"
                  dir="ltr"
                  role="group"
                  aria-label="کد تأیید ۶ رقمی"
                >
                  {Array.from({ length: OTP_LENGTH }, (_, index) => {
                    const digit = otpCode[index] ?? "";
                    return (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit ? toPersianDigits(digit) : ""}
                        onChange={(event) => handleOtpDigitChange(index, event)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        onPaste={(event) => handleOtpPaste(index, event)}
                        onFocus={(event) => event.target.select()}
                        disabled={otpDisabled}
                        aria-label={`رقم ${toPersianDigits(index + 1)}`}
                        className={`h-12 w-10 rounded-xl border bg-cream/60 text-center text-xl font-bold text-ink outline-none transition sm:h-14 sm:w-11 sm:text-2xl ${
                          otpInvalid
                            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200/60"
                            : "border-ink/10 focus:border-pine focus:ring-2 focus:ring-pine/20"
                        } disabled:opacity-50`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                <Clock className="size-4" />
                {timer > 0 ? (
                  <span>
                    زمان باقی‌مانده:{" "}
                    <span className="font-semibold tabular-nums text-ink" dir="ltr">
                      {toPersianDigits(
                        `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
                          timer % 60,
                        ).padStart(2, "0")}`,
                      )}
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="font-medium text-pine hover:underline"
                    onClick={() => {
                      setStep("phone");
                      setOtpCode("");
                      setOtpInvalid(false);
                    }}
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleVerifyOtp()}
                  disabled={
                    loadingVerify || otpCode.length !== OTP_LENGTH || timer === 0
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
                >
                  {loadingVerify ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  تأیید و ورود
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpCode("");
                    setOtpInvalid(false);
                  }}
                  className="flex-1 rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm font-medium hover:border-pine/40 disabled:opacity-50"
                  disabled={loadingVerify}
                >
                  بازگشت
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
