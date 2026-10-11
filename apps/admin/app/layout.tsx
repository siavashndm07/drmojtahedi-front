import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import AdminApp from "@/components/AdminApp";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { brand } from "@drmojtahedi/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `پنل مدیریت | ${brand.shortName}`,
    template: `%s | ${brand.shortName} Admin`,
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="bg-cream font-sans text-ink antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AdminApp>{children}</AdminApp>
            <Toaster position="bottom-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
