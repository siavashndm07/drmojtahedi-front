"use client";

import dynamic from "next/dynamic";
import type { LocationMapPickerProps } from "@/components/LocationMapPicker";

const LocationMapPicker = dynamic(() => import("@/components/LocationMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-cream/50 text-sm text-ink-muted dark:bg-mint/20">
      در حال بارگذاری نقشه…
    </div>
  ),
});

export default function LocationMapPickerLazy(props: LocationMapPickerProps) {
  return <LocationMapPicker {...props} />;
}
