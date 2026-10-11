import type { Metadata } from "next";
import LoginClient from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "ورود",
};

export default function LoginPage() {
  return <LoginClient />;
}
