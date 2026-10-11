import type { Metadata } from "next";
import AccountDashboardPage from "./AccountDashboard";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خلاصه حساب",
  description: "خلاصه حساب کاربری بنیاد فرهنگی دکتر مجتهدی.",
  path: "/account",
});

export default function Page() {
  return <AccountDashboardPage />;
}
