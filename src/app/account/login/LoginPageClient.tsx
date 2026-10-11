"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FadeIn } from "@/components/shared/FadeIn";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { PageHero } from "@/components/shared/PageHero";
import { useAuth } from "@/lib/auth";

export default function LoginPageClient() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/account");
  }, [ready, user, router]);

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "عضویت", href: "/account/membership" },
          { label: "ورود" },
        ]}
        eyebrow="حساب کاربری"
        title="ورود با پیامک"
        description="شماره موبایل خود را وارد کنید؛ کد یک‌بارمصرف ارسال می‌شود."
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm md:p-8">
            <LoginPanel
              showCloseButton={false}
              onLoginSuccess={() => router.push("/account")}
            />
            <p className="mt-4 text-center text-sm text-ink-muted">
              حساب ندارید؟ با همان شماره به‌صورت خودکار ثبت‌نام می‌شوید.{" "}
              <Link href="/account/membership" className="text-pine hover:underline">
                انواع عضویت
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
