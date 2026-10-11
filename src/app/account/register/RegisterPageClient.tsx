"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FadeIn } from "@/components/shared/FadeIn";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { PageHero } from "@/components/shared/PageHero";
import { useAuth } from "@/lib/auth";

export default function RegisterPageClient() {
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
          { label: "ثبت‌نام" },
        ]}
        eyebrow="عضویت"
        title="ثبت‌نام با پیامک"
        description="شماره موبایل را وارد کنید؛ پس از تأیید OTP می‌توانید پروفایل را تکمیل کنید."
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm md:p-8">
            <LoginPanel
              showCloseButton={false}
              onLoginSuccess={() => router.push("/account/profile")}
            />
            <p className="mt-4 text-center text-sm text-ink-muted">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link href="/account/login" className="text-pine hover:underline">
                ورود
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
