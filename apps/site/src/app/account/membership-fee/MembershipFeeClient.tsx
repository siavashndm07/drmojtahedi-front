"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { PAYMENT_BANKS, formatRials } from "@/lib/mock/donations";
import { toPersianDigits } from "@/lib/utils/digits";

export default function MembershipFeeClient() {
  const { user, updateProfile } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  if (!user) return null;

  const fee = user.annualFeeRials;
  const alreadyPaid = user.membershipStatus === "active";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-2xl text-ink">حق عضویت سالانه</h1>
        <p className="mt-2 text-sm leading-7 text-ink-muted">
          مبلغ حق عضویت مطابق مصوبه هیئت مؤسسه. درگاه واقعی در فاز بعدی متصل
          می‌شود؛ فعلاً پرداخت آزمایشی وضعیت عضویت را به‌روز می‌کند.
        </p>
      </div>

      <div className="w-full space-y-5">
        <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm">
          <p className="text-xs tracking-[0.14em] text-bronze">مبلغ سالانه</p>
          <p className="mt-3 text-3xl font-bold text-pine" dir="ltr">
            {toPersianDigits(formatRials(fee))}
            <span className="ms-2 text-sm font-medium text-ink-muted">ریال</span>
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            وضعیت فعلی:{" "}
            <strong className="text-ink">
              {user.membershipStatus === "active"
                ? "فعال"
                : user.membershipStatus === "expired"
                  ? "منقضی"
                  : "در انتظار تکمیل"}
            </strong>
            {user.membershipValidUntil !== "—" ? (
              <> · اعتبار تا {toPersianDigits(user.membershipValidUntil)}</>
            ) : null}
          </p>
        </div>

        {alreadyPaid ? (
          <p className="rounded-xl bg-mint-soft px-4 py-3 text-sm text-pine">
            حق عضویت این دوره برای شما فعال است.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">انتخاب درگاه</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`rounded-xl border px-4 py-4 text-start transition ${
                    selectedBank === bank.id
                      ? "border-pine bg-mint-soft/60"
                      : "border-ink/10 bg-surface hover:border-pine/40"
                  }`}
                >
                  <span className="block text-sm font-bold">{bank.name}</span>
                  <span className="mt-1 block text-xs text-ink-muted">
                    {bank.description}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!selectedBank}
              onClick={() => {
                const bank = PAYMENT_BANKS.find((b) => b.id === selectedBank);
                if (!bank) return;
                const year = new Date().getFullYear() + 1;
                void updateProfile({
                  membershipStatus: "active",
                  membershipValidUntil: `${year}/12/29`,
                  membershipType: user.membershipType || "عضو پیوسته",
                });
                setMessage(`پرداخت آزمایشی از طریق ${bank.name} ثبت شد.`);
              }}
              className="w-full rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-50"
            >
              پرداخت آزمایشی
            </button>
          </div>
        )}

        {message ? (
          <p className="rounded-xl bg-mint-soft px-4 py-3 text-sm text-pine">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
