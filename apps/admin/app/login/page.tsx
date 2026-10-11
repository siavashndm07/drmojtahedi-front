"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { brand } from "@drmojtahedi/shared";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await login(username.trim(), password);
      toast.success("ورود موفق");
      router.replace("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ورود ناموفق");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm sm:p-8"
      >
        <p className="text-xs text-ink-muted">پنل مدیریت</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{brand.shortName}</h1>
        <p className="mt-2 text-sm text-ink-muted">ورود کارکنان با نام کاربری</p>
        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block font-medium">نام کاربری</span>
          <input
            className="w-full rounded-xl border border-ink/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:border-pine/40"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium">رمز عبور</span>
          <input
            type="password"
            className="w-full rounded-xl border border-ink/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:border-pine/40"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-pine py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60"
        >
          {busy ? "…" : "ورود"}
        </button>
        <p className="mt-4 text-[11px] leading-6 text-ink-muted">
          پیش‌فرض توسعه: admin / admin123456 — پس از seed بک‌اند.
        </p>
      </form>
    </div>
  );
}
