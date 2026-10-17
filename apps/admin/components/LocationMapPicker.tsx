"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Crosshair, Loader2 } from "lucide-react";
import {
  DEFAULT_MAP_CENTER,
  reverseGeocode,
  type MapCoordinates,
} from "@/lib/geocode";
import { toPersianDigits } from "@/lib/digits";

import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type LocationMapPickerProps = {
  value: MapCoordinates | null;
  onChange: (coords: MapCoordinates) => void;
  onAddressSuggestion?: (line: string) => void;
  className?: string;
};

function MapViewportSync({
  center,
  zoom,
}: {
  center: MapCoordinates;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lon], zoom, { animate: true });
  }, [center.lat, center.lon, zoom, map]);

  return null;
}

function MapClickHandler({
  onPick,
}: {
  onPick: (coords: MapCoordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lon: event.latlng.lng });
    },
  });
  return null;
}

export default function LocationMapPicker({
  value,
  onChange,
  onAddressSuggestion,
  className = "",
}: LocationMapPickerProps) {
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const center = value ?? DEFAULT_MAP_CENTER;
  const zoom = value ? 16 : 13;

  const coordsLabel = useMemo(() => {
    if (!value) return null;
    return `${toPersianDigits(value.lat.toFixed(5))} ، ${toPersianDigits(value.lon.toFixed(5))}`;
  }, [value]);

  async function pickLocation(coords: MapCoordinates) {
    onChange(coords);

    if (!onAddressSuggestion) return;

    setResolving(true);
    try {
      const suggestion = await reverseGeocode(coords);
      if (suggestion) onAddressSuggestion(suggestion);
    } finally {
      setResolving(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void pickLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          روی نقشه کلیک کنید یا نشانگر را بکشید؛ آدرس در کادر زیر پر می‌شود.
        </p>
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:border-pine/30 disabled:opacity-60"
        >
          {locating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Crosshair className="h-3.5 w-3.5" aria-hidden />
          )}
          موقعیت فعلی
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={zoom}
          scrollWheelZoom
          attributionControl={false}
          className="z-0 h-64 w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapViewportSync center={center} zoom={zoom} />
          <MapClickHandler onPick={pickLocation} />
          {value ? (
            <Marker
              position={[value.lat, value.lon]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend(event) {
                  const marker = event.target as L.Marker;
                  const latLng = marker.getLatLng();
                  void pickLocation({ lat: latLng.lat, lon: latLng.lng });
                },
              }}
            />
          ) : null}
        </MapContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {coordsLabel ? (
          <span dir="ltr" className="rounded-full bg-cream px-2.5 py-1 dark:bg-mint/40">
            {coordsLabel}
          </span>
        ) : (
          <span>هنوز موقعیتی انتخاب نشده</span>
        )}
        {resolving ? (
          <span className="inline-flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            در حال یافتن آدرس…
          </span>
        ) : null}
      </div>
    </div>
  );
}
