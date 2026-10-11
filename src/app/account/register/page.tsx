import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ثبت‌نام",
  description: "ثبت‌نام با کد یک‌بارمصرف پیامکی در بنیاد فرهنگی دکتر مجتهدی.",
  path: "/account/register",
});

export default function RegisterPage() {
  return <RegisterPageClient />;
}
