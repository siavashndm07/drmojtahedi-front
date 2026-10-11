"use client";

import { DonateForm } from "@/components/account/DonateForm";

export default function AccountDonateClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-2xl text-ink">کمک بلاعوض</h1>
        <p className="mt-2 text-sm text-ink-muted">
          مبلغ و هدف کمک را انتخاب کنید؛ رسید در سوابق حساب ذخیره می‌شود.
        </p>
      </div>
      <DonateForm mode="member" />
    </div>
  );
}
