import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ورود",
  description: "ورود با کد یک‌بارمصرف پیامکی به حساب کاربری بنیاد.",
  path: "/account/login",
});

export default function LoginPage() {
  return <LoginPageClient />;
}
