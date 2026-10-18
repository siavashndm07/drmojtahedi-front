"use client";

import dynamic from "next/dynamic";

const ContactLocationMap = dynamic(() => import("./ContactLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[22rem] items-center justify-center bg-mint-soft/50 text-sm text-ink-muted">
      در حال بارگذاری نقشه…
    </div>
  ),
});

export function ContactMap({
  lat,
  lon,
  label,
}: {
  lat: number;
  lon: number;
  label: string;
}) {
  return <ContactLocationMap lat={lat} lon={lon} label={label} />;
}
