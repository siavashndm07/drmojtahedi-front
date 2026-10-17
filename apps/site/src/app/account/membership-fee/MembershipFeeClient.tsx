"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, Loader2, Receipt, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentGatewayIcon } from "@/components/PaymentGatewayIcon";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";
import {
  getDonatePaymentOptions,
  type DonatePaymentOptions,
} from "@/lib/api/donate";
import {
  listMyMembershipFees,
  startMembershipFeePayment,
  type MembershipFeePayment,
} from "@/lib/api/membershipFee";
import { formatRials } from "@/lib/mock/donations";
import { toEnglishDigits, toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

function formatCardNumber(value: string): string {
  const digits = toEnglishDigits(value).replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatFaDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString("fa-IR")} · ${d.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return iso;
  }
}

const membershipStatusLabel = {
  active: "فعال",
  expired: "منقضی",
  pending: "در انتظار پرداخت",
} as const;

const paymentStatusLabel: Record<string, string> = {
  pending: "در انتظار",
  redirected: "هدایت به درگاه",
  awaiting_transfer: "در انتظار واریز",
  paid: "پرداخت‌شده",
  cancelled: "لغوشده",
  failed: "ناموفق",
};

export default function MembershipFeeClient() {
  const { user, accessToken } = useAuth();
  const [options, setOptions] = useState<DonatePaymentOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [history, setHistory] = useState<MembershipFeePayment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [methodId, setMethodId] = useState<string | null>(null);
  const [gatewayId, setGatewayId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [cardReceipt, setCardReceipt] = useState<{
    cardHolder: string;
    cardNumber: string;
    transactionId: string;
  } | null>(null);

  const reloadHistory = useCallback(async () => {
    if (!accessToken || accessToken.startsWith("demo-")) {
      setHistory([]);
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    try {
      setHistory(await listMyMembershipFees(accessToken));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    let cancelled = false;
    async function loadOptions() {
      setOptionsLoading(true);
      try {
        const data = await getDonatePaymentOptions();
        if (cancelled) return;
        setOptions(data);
        setMethodId(data.methods[0]?.id ?? null);
        setGatewayId(data.defaultGateway ?? data.gateways[0]?.id ?? null);
      } catch {
        if (!cancelled) setOptions(null);
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }
    void loadOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void reloadHistory();
  }, [reloadHistory]);

  if (!user) return null;

  const fee = user.annualFeeRials;
  const hasTier = Boolean(user.membershipTierId || user.membershipType);
  const feeRequired = fee > 0;
  const isActive = user.membershipStatus === "active";
  const methods = options?.methods ?? [];
  const gateways = options?.gateways ?? [];
  const card = options?.cardToCard;
  const onlineSelected = methodId === "online";
  const cardSelected = methodId === "card_to_card";
  const canPay =
    feeRequired &&
    Boolean(methodId) &&
    (cardSelected || (onlineSelected && Boolean(gatewayId))) &&
    !optionsLoading &&
    Boolean(accessToken) &&
    !accessToken?.startsWith("demo-");

  async function handlePay() {
    if (!accessToken || accessToken.startsWith("demo-")) {
      toast.error("برای پرداخت وارد حساب شوید.");
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

    setPaying(true);
    try {
      const result = await startMembershipFeePayment(accessToken, {
        method: methodId,
        gateway: onlineSelected ? gatewayId : null,
      });

      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }

      setCardReceipt({
        cardHolder: result.cardToCard?.cardHolder || card?.cardHolder || "",
        cardNumber: result.cardToCard?.cardNumber || card?.cardNumber || "",
        transactionId: result.transactionId || `MFEE-${result.paymentId}`,
      });
      toast.success("درخواست ثبت شد؛ مشخصات کارت را ببینید.");
      await reloadHistory();
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
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-2xl text-ink">حق عضویت سالانه</h1>
        <p className="mt-2 text-sm leading-7 text-ink-muted">
          پس از پرداخت موفق و تأیید بنیاد، وضعیت عضویت فعال می‌شود.
        </p>
      </div>

      <div className="w-full space-y-5">
        <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm">
          <p className="text-xs tracking-[0.14em] text-bronze">مبلغ سالانه</p>
          {user.membershipType ? (
            <p className="mt-2 text-sm font-medium text-ink">{user.membershipType}</p>
          ) : null}
          <p className="mt-3 text-3xl font-bold text-pine" dir="ltr">
            {toPersianDigits(formatRials(fee))}
            <span className="ms-2 text-sm font-medium text-ink-muted">ریال</span>
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            وضعیت فعلی:{" "}
            <strong className="text-ink">
              {membershipStatusLabel[user.membershipStatus]}
            </strong>
            {isActive && user.membershipValidUntil !== "—" ? (
              <> · اعتبار تا {toPersianDigits(user.membershipValidUntil)}</>
            ) : null}
          </p>
        </div>

        {!hasTier ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            هنوز ارکان عضویت برای شما تعیین نشده. پس از تخصیص توسط بنیاد، مبلغ حق
            عضویت اینجا نمایش داده می‌شود.
          </p>
        ) : !feeRequired ? (
          <p className="rounded-xl bg-mint-soft px-4 py-3 text-sm text-pine">
            برای ارکان «{user.membershipType}» حق عضویت سالانه تعریف نشده است.
          </p>
        ) : cardReceipt ? (
          <div className="space-y-3 rounded-2xl border border-ink/10 bg-cream/70 p-5">
            <p className="text-sm font-semibold text-ink">
              آماده واریز کارت‌به‌کارت
            </p>
            <p className="text-sm leading-7 text-ink-muted">
              مبلغ را واریز کنید؛ پس از تأیید مالی در پنل، رکورد شما «پرداخت‌شده»
              می‌شود.
            </p>
            {cardReceipt.cardHolder ? (
              <p className="text-sm text-ink-muted">{cardReceipt.cardHolder}</p>
            ) : null}
            {cardReceipt.cardNumber ? (
              <p className="font-semibold tracking-wider text-ink" dir="ltr">
                {toPersianDigits(formatCardNumber(cardReceipt.cardNumber))}
              </p>
            ) : null}
            <p className="text-xs text-ink-muted" dir="ltr">
              {cardReceipt.transactionId}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {isActive ? (
              <p className="rounded-xl bg-mint-soft/70 px-4 py-3 text-sm text-pine">
                عضویت این دوره فعال است. در صورت نیاز می‌توانید پرداخت دوره بعد را
                ثبت کنید.
              </p>
            ) : null}
            {optionsLoading ? (
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 className="size-4 animate-spin" />
                بارگذاری روش‌های پرداخت…
              </p>
            ) : methods.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                روش پرداختی در تنظیمات ادمین فعال نیست.
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
                            : "border-ink/10 bg-surface hover:border-pine/40",
                        )}
                      >
                        <span className="flex items-center gap-2 text-sm font-bold">
                          {method.id === "card_to_card" ? (
                            <CreditCard className="size-4 text-pine" />
                          ) : (
                            <ShieldCheck className="size-4 text-pine" />
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
                    <p className="mb-2 text-sm font-medium text-ink">درگاه بانکی</p>
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
                              : "border-ink/10 bg-surface hover:border-pine/40",
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

                <button
                  type="button"
                  disabled={!canPay || paying}
                  onClick={() => void handlePay()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
                >
                  {paying ? <Loader2 className="size-4 animate-spin" /> : null}
                  {onlineSelected
                    ? "پرداخت و هدایت به بانک"
                    : "ثبت و نمایش کارت"}
                </button>
              </>
            )}
          </div>
        )}

      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-ink">سوابق پرداخت حق عضویت</h2>
          <p className="mt-1 text-sm text-ink-muted">
            همه پرداخت‌ها و وضعیت تأیید آن‌ها.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-mint-soft/50 text-ink">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">تاریخ</th>
                  <th className="px-4 py-3 text-start font-semibold">ارکان</th>
                  <th className="px-4 py-3 text-start font-semibold">مبلغ</th>
                  <th className="px-4 py-3 text-start font-semibold">روش</th>
                  <th className="px-4 py-3 text-start font-semibold">وضعیت</th>
                  <th className="px-4 py-3 text-start font-semibold">تراکنش</th>
                </tr>
              </thead>
              <tbody>
                {historyLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-ink-muted"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        در حال بارگذاری…
                      </span>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-2">
                      <EmptyState
                        icon={Receipt}
                        title="هنوز پرداختی ثبت نشده"
                        description="پس از پرداخت حق عضویت، تاریخ، مبلغ و وضعیت تراکنش اینجا می‌ماند."
                        className="border-0 bg-transparent py-8 shadow-none"
                      />
                    </td>
                  </tr>
                ) : (
                  history.map((row) => {
                    const status = row.status || "pending";
                    return (
                      <tr key={row.id} className="border-t border-ink/8">
                        <td className="px-4 py-3 text-ink-muted">
                          {formatFaDateTime(row.createdAt || row.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {row.tierTitle || row.tier_title || "—"}
                          {row.periodYear || row.period_year
                            ? ` · ${toPersianDigits(String(row.periodYear || row.period_year))}`
                            : ""}
                        </td>
                        <td className="px-4 py-3 font-medium" dir="ltr">
                          {toPersianDigits(formatRials(row.amount))}
                        </td>
                        <td className="px-4 py-3">
                          {row.gatewayLabel ||
                            (row.method === "card_to_card"
                              ? "کارت‌به‌کارت"
                              : row.gateway || "—")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-[11px]",
                              status === "paid"
                                ? "bg-mint-soft text-pine"
                                : status === "cancelled" || status === "failed"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-800",
                            )}
                          >
                            {paymentStatusLabel[status] ?? status}
                          </span>
                        </td>
                        <td className="px-4 py-3" dir="ltr">
                          {row.transactionId || row.transaction_id || "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
