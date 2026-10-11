import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ویرایش اطلاعات کاربری",
  description: "ویرایش پروفایل عضو بنیاد.",
  path: "/account/profile",
});

export default function Page() {
  return <ProfileClient />;
}
