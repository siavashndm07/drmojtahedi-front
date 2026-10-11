"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { LoginPanel } from "@/components/auth/LoginPanel";

type LoginDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (phone: string) => void;
};

export function LoginDrawer({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="login-overlay"
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="ورود یا ثبت‌نام"
            className="w-full max-w-md overflow-hidden rounded-t-3xl border border-ink/10 bg-surface shadow-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0.85 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center pb-1 pt-3 sm:hidden" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-ink/15" />
            </div>
            <LoginPanel
              onClose={onClose}
              onLoginSuccess={onLoginSuccess}
              showCloseButton
            />
            <div className="space-y-2 px-6 pb-2 text-xs leading-6 text-ink-muted sm:text-sm">
              <p className="flex items-start justify-center gap-2 text-center">
                <ShieldCheck
                  className="mt-0.5 size-4 shrink-0 text-pine"
                  aria-hidden
                />
                <span>ورود با کد یک‌بارمصرف؛ بدون نیاز به رمز عبور.</span>
              </p>
              <p className="mb-4 flex items-start justify-center gap-2 text-center">
                <Lock className="mt-0.5 size-4 shrink-0 text-pine" aria-hidden />
                <span>شماره شما فقط برای ورود و ارتباط بنیاد استفاده می‌شود.</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
