import type { Metadata } from "next";
import Link from "next/link";
import { Check, XCircle } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "نتیجه پرداخت",
  description: "بازگشت از درگاه پرداخت کمک بلاعوض",
  path: "/donate/callback",
});

type Props = {
  searchParams: Promise<{ donation?: string; Status?: string; status?: string }>;
};

export default async function DonateCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = (params.Status || params.status || "").toLowerCase();
  const ok = status === "ok" || status === "success" || status === "1";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span
        className={`inline-flex size-14 items-center justify-center rounded-full ${
          ok ? "bg-mint-soft text-pine" : "bg-red-50 text-red-600"
        }`}
      >
        {ok ? (
          <Check className="size-7" strokeWidth={2} aria-hidden />
        ) : (
          <XCircle className="size-7" strokeWidth={2} aria-hidden />
        )}
      </span>
      <h1 className="mt-4 text-2xl font-bold text-ink">
        {ok ? "پرداخت دریافت شد" : "پرداخت کامل نشد"}
      </h1>
      <p className="mt-2 text-sm leading-7 text-ink-muted">
        {ok
          ? "از حمایت شما سپاسگزاریم. در صورت لزوم وضعیت نهایی پس از تأیید درگاه به‌روزرسانی می‌شود."
          : "اگر مبلغی از حساب شما کسر شده، طی ساعات آینده به حساب بازمی‌گردد. می‌توانید دوباره تلاش کنید."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/account/donations"
          className="inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
        >
          سوابق کمک
        </Link>
        <Link
          href="/donate"
          className="inline-flex rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium"
        >
          بازگشت به کمک
        </Link>
      </div>
    </main>
  );
}
