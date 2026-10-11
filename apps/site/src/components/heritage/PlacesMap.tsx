"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type PlaceMapItem = {
  slug: string;
  title: string;
  description?: string;
  location?: string;
  coordinates?: { lat: number; lng: number } | null;
};

/** Rough Iran bbox for projecting pins without a map SDK. */
const BOUNDS = { latMin: 25, latMax: 40, lngMin: 44, lngMax: 63 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * 100;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * 100;
  return {
    left: `${Math.min(96, Math.max(4, x))}%`,
    top: `${Math.min(92, Math.max(8, y))}%`,
  };
}

export function PlacesMap({ places }: { places: PlaceMapItem[] }) {
  const withCoords = places.filter((p) => p.coordinates);
  const [active, setActive] = useState(withCoords[0]?.slug ?? "");

  const selected = places.find((p) => p.slug === active) ?? withCoords[0];

  if (withCoords.length === 0) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div
        className="relative min-h-[16rem] overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-br from-mint-soft via-cream to-bronze/10 shadow-sm dark:from-mint/30 dark:via-surface dark:to-pine/20 sm:min-h-[20rem]"
        role="img"
        aria-label="نقشهٔ مکان‌های مرتبط"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 35%, rgba(47,127,120,0.25), transparent 40%), radial-gradient(circle at 70% 55%, rgba(166,124,82,0.2), transparent 35%)",
          }}
          aria-hidden
        />
        <p className="absolute start-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-medium text-ink-muted shadow-sm">
          جغرافیای میراث
        </p>
        {withCoords.map((place) => {
          const pos = project(place.coordinates!.lat, place.coordinates!.lng);
          const isActive = place.slug === selected?.slug;
          return (
            <button
              key={place.slug}
              type="button"
              style={pos}
              onClick={() => setActive(place.slug)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full rounded-full p-1.5 shadow-md transition",
                isActive
                  ? "z-10 scale-110 bg-pine text-white"
                  : "bg-surface text-pine hover:scale-105",
              )}
              aria-pressed={isActive}
              aria-label={place.title}
            >
              <MapPin className="size-4" aria-hidden />
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-bronze">{selected.location}</p>
          <h3 className="mt-2 text-xl font-medium text-ink">{selected.title}</h3>
          {selected.description ? (
            <p className="mt-3 text-sm leading-8 text-ink-muted">
              {selected.description}
            </p>
          ) : null}
          <Link
            href={`/heritage/places/${selected.slug}`}
            className="mt-5 inline-flex text-sm font-semibold text-pine hover:underline"
          >
            صفحهٔ مکان
          </Link>
        </div>
      ) : null}
    </div>
  );
}
