import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountLayoutClient } from "./AccountLayoutClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "حساب کاربری",
    description: "مدیریت پروفایل، عضویت و کمک‌های خیرخواهانه.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
