import type { Metadata } from "next";
import AccountDonateClient from "./AccountDonateClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کمک بلاعوض",
  description: "پرداخت کمک‌های خیرخواهانه از حساب کاربری.",
  path: "/account/donate",
});

export default function Page() {
  return <AccountDonateClient />;
}
