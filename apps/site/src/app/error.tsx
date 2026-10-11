"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="content-shell section-pad">
      <ErrorState
        title="خطایی در بارگذاری صفحه رخ داد"
        description="لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت، بعداً مراجعه کنید."
        onRetry={reset}
      />
    </div>
  );
}
