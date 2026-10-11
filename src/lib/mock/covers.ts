import type { MediaAsset } from "@/lib/types";

/** Archival stills copied from the legacy site slider for card covers. */
export const COVER_IMAGES = {
  memorial: "/images/covers/M0.jpg",
  alborz: "/images/covers/M1.jpg",
  campus: "/images/covers/M2.jpg",
  portrait: "/images/covers/M3.jpg",
  gathering: "/images/covers/M4.jpg",
  archive: "/images/covers/M5.jpg",
  ceremony: "/images/covers/M6.jpg",
  library: "/images/covers/M7.jpg",
  heritage: "/images/covers/M9.jpg",
} as const;

export function coverAsset(
  key: keyof typeof COVER_IMAGES,
  alt: string,
): MediaAsset {
  return {
    src: COVER_IMAGES[key],
    alt,
    width: 800,
    height: 300,
  };
}
