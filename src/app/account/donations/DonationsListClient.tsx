"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { formatRials } from "@/lib/mock/donations";
import { toPersianDigits } from "@/lib/utils/digits";

export default function DonationsListClient() {
  const { donations } = useAuth();
  const total = donations.reduce((sum, item) => sum + item.amountRials, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-display text-2xl text-ink">سوابق کمک</h1>
          <p className="mt-2 text-sm text-ink-muted">
            فهرست کمک‌های بلاعوض ثبت‌شده در حساب شما.
          </p>
        </div>
        <Link
          href="/account/donate"
          className="inline-flex rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white hover:bg-pine-dark"
        >
          کمک جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-mint-soft/50 text-ink">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">ردیف</th>
                <th className="px-4 py-3 text-start font-semibold">تاریخ</th>
                <th className="px-4 py-3 text-start font-semibold">مبلغ</th>
                <th className="px-4 py-3 text-start font-semibold">تراکنش</th>
                <th className="px-4 py-3 text-start font-semibold">بانک</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-ink-muted"
                  >
                    هنوز کمکی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                donations.map((item, index) => (
                  <tr key={item.id} className="border-t border-ink/8">
                    <td className="px-4 py-3">{toPersianDigits(index + 1)}</td>
                    <td className="px-4 py-3">
                      {item.dateLabel}
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {item.timeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" dir="ltr">
                      {toPersianDigits(formatRials(item.amountRials))}
                    </td>
                    <td className="px-4 py-3" dir="ltr">
                      {item.transactionId}
                    </td>
                    <td className="px-4 py-3">{item.bankName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {donations.length > 0 ? (
          <div className="border-t border-ink/10 bg-cream/40 px-4 py-3 text-sm text-ink-muted">
            جمع:{" "}
            <strong className="text-pine" dir="ltr">
              {toPersianDigits(formatRials(total))}
            </strong>{" "}
            ریال
          </div>
        ) : null}
      </div>
    </div>
  );
}
