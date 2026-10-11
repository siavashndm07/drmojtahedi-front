import type { Metadata } from "next";
import DonationsListClient from "./DonationsListClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "لیست کمک‌ها",
  description: "سوابق کمک‌های بلاعوض عضو.",
  path: "/account/donations",
});

export default function Page() {
  return <DonationsListClient />;
}
