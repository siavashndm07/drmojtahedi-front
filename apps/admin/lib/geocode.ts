/** Default map center — دولَت / کلاهدوز، تهران */
export const DEFAULT_MAP_CENTER = {
  lat: 35.7764,
  lon: 51.4502,
} as const;

export type MapCoordinates = {
  lat: number;
  lon: number;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: Record<string, string>;
};

function buildPersianAddress(payload: NominatimReverseResponse): string | null {
  const parts = payload.address;
  if (!parts) return payload.display_name?.trim() ?? null;

  const segments = [
    parts.state,
    parts.city ?? parts.town ?? parts.village,
    parts.suburb ?? parts.neighbourhood ?? parts.quarter,
    parts.road,
    parts.house_number ? `پلاک ${parts.house_number}` : "",
  ].filter(Boolean);

  if (segments.length > 0) return segments.join("، ");
  return payload.display_name?.trim() ?? null;
}

export async function reverseGeocode(
  coords: MapCoordinates,
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
    format: "json",
    "accept-language": "fa",
    zoom: "18",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "fa",
      },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as NominatimReverseResponse;
  return buildPersianAddress(data);
}

export function hasMapCoordinates(
  coords: Partial<MapCoordinates> | null | undefined,
): coords is MapCoordinates {
  return (
    typeof coords?.lat === "number" &&
    Number.isFinite(coords.lat) &&
    typeof coords?.lon === "number" &&
    Number.isFinite(coords.lon)
  );
}
