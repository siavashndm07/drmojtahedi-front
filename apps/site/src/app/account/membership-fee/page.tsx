import type { Metadata } from "next";
import MembershipFeeClient from "./MembershipFeeClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "پرداخت حق عضویت",
  description: "پرداخت حق عضویت سالانه بنیاد.",
  path: "/account/membership-fee",
});

export default function Page() {
  return <MembershipFeeClient />;
}
