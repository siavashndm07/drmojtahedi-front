"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { GalleryItem } from "@/lib/api/galleries";

export default function GalleryAlbum({
  title,
  kind,
  items,
}: {
  title: string;
  kind: "images" | "videos";
  items: GalleryItem[];
}) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active == null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current == null ? current : Math.min(items.length - 1, current + 1),
        );
      }
      if (event.key === "ArrowRight") {
        setActive((current) => (current == null ? current : Math.max(0, current - 1)));
      }
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, items.length]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="هنوز رسانه‌ای در این گالری نیست"
        description="تصاویر یا ویدئوهای این آلبوم به‌زودی اینجا قرار می‌گیرند."
      />
    );
  }

  if (kind === "videos") {
    return (
      <ul className="grid gap-6">
        {items.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-ink">
            <video
              src={item.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full"
            />
            {item.caption ? (
              <p className="bg-surface px-4 py-3 text-sm text-ink-muted">{item.caption}</p>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  const current = active == null ? null : items[active];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={item.caption || title}
              onClick={() => setActive(index)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mint-soft"
            >
              <Image
                src={item.url}
                alt={item.caption || title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
      {current ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="بستن"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
              <Image
                src={current.url}
                alt={current.caption || title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-white">
              <button
                type="button"
                aria-label="قبلی"
                disabled={active === 0}
                onClick={() => setActive((value) => (value == null ? value : value - 1))}
                className="rounded-full bg-white/10 p-2 disabled:opacity-40"
              >
                <ChevronRight className="size-5" />
              </button>
              <p className="text-sm">{current.caption || title}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="بعدی"
                  disabled={active === items.length - 1}
                  onClick={() => setActive((value) => (value == null ? value : value + 1))}
                  className="rounded-full bg-white/10 p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="بستن نمایش"
                  onClick={() => setActive(null)}
                  className="rounded-full bg-white/10 p-2"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
