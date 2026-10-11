"use client";

import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <PageHeader
        title="حساب ادمین"
        description="اطلاعات نشست کارکنان — الگوی حساب پنل بینا (نسخهٔ ساده)."
      />
      <div className="max-w-lg space-y-4 rounded-2xl border border-ink/10 bg-surface p-5">
        <div>
          <p className="text-xs text-ink-muted">نام نمایشی</p>
          <p className="mt-1 font-semibold text-ink">{user?.displayName || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">نام کاربری</p>
          <p className="mt-1 font-medium text-ink" dir="ltr">
            {user?.username || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">سطح</p>
          <p className="mt-1 text-sm text-ink-muted">
            {user?.isSuperuser ? "سوپریوزر" : "کارمند"}
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary !text-red-600">
          خروج از پنل
        </button>
      </div>
    </div>
  );
}
