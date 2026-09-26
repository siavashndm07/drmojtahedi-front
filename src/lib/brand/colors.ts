/**
 * Brand color system — SensibleCool architecture.
 * CSS vars are RGB triplets so `rgb(var(--pine) / 0.5)` works.
 * Admin can later set `siteSettings.brandPaletteId` (or API brandColors).
 */

export type BrandColors = {
  pine: string;
  pineDark: string;
  mint: string;
  mintSoft: string;
  mintDeep: string;
  accent?: string;
};

export type BrandColorKey = keyof BrandColors;

export const BRAND_PALETTE_COLOR_KEYS = [
  "pine",
  "pineDark",
  "mint",
  "mintSoft",
  "mintDeep",
] as const satisfies ReadonlyArray<Exclude<BrandColorKey, "accent">>;

/** SensibleCool mint / teal — default brand. */
export const DEFAULT_BRAND_COLORS: BrandColors = {
  pine: "#2F7F78",
  pineDark: "#246661",
  mint: "#D8EDEB",
  mintSoft: "#F0F7F6",
  mintDeep: "#2F7F78",
};

export const DEFAULT_DARK_BRAND_COLORS: BrandColors = {
  pine: "#5BBFB7",
  pineDark: "#4AADA5",
  mint: "#2A3A38",
  mintSoft: "#1F2423",
  mintDeep: "#5BBFB7",
};

export type BrandColorPalette = {
  id: string;
  label: string;
  description: string;
  colors: BrandColors;
};

/** Presets for future admin theme picker (same idea as SensibleCool). */
export const BRAND_COLOR_PALETTES: BrandColorPalette[] = [
  {
    id: "sensiblecool",
    label: "مینت",
    description: "سبز آبی آرام — پیش‌فرض SensibleCool",
    colors: { ...DEFAULT_BRAND_COLORS },
  },
  {
    id: "heritage",
    label: "میراث",
    description: "سبز لوگوی بنیاد (#4A7C44)",
    colors: {
      pine: "#4A7C44",
      pineDark: "#3A6336",
      mint: "#DCE8D6",
      mintSoft: "#F0F5ED",
      mintDeep: "#4A7C44",
    },
  },
  {
    id: "forest",
    label: "جنگلی",
    description: "سبز عمیق — طبیعی و اصیل",
    colors: {
      pine: "#166534",
      pineDark: "#14532D",
      mint: "#DCFCE7",
      mintSoft: "#F0FDF4",
      mintDeep: "#166534",
    },
  },
  {
    id: "sage",
    label: "مریم‌گلی",
    description: "سبز خاکی — مینیمال",
    colors: {
      pine: "#5F7A61",
      pineDark: "#4C624E",
      mint: "#E4EDE5",
      mintSoft: "#F2F6F2",
      mintDeep: "#5F7A61",
    },
  },
  {
    id: "teal",
    label: "فیروزه‌ای",
    description: "سبز فیروزه‌ای — تمیز و امروزی",
    colors: {
      pine: "#0D9488",
      pineDark: "#0F766E",
      mint: "#CCFBF1",
      mintSoft: "#F0FDFA",
      mintDeep: "#0D9488",
    },
  },
];

export const DEFAULT_BRAND_PALETTE_ID = "sensiblecool";

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!HEX_RE.test(withHash)) return null;
  return withHash.toUpperCase();
}

export function getBrandPalette(id?: string | null): BrandColorPalette {
  const match = BRAND_COLOR_PALETTES.find((p) => p.id === id);
  return match ?? BRAND_COLOR_PALETTES[0];
}

export function mergeBrandColors(raw?: Partial<BrandColors> | null): BrandColors {
  const merged: BrandColors = { ...DEFAULT_BRAND_COLORS };
  if (!raw || typeof raw !== "object") return merged;
  for (const key of BRAND_PALETTE_COLOR_KEYS) {
    const normalized = normalizeHex(String(raw[key] ?? ""));
    if (normalized) merged[key] = normalized;
  }
  const accent = normalizeHex(String(raw.accent ?? ""));
  if (accent) merged.accent = accent;
  return merged;
}

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex) ?? DEFAULT_BRAND_COLORS.pine;
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function mixRgb(a: Rgb, b: Rgb, weight: number): Rgb {
  const w = Math.max(0, Math.min(1, weight));
  return {
    r: a.r * (1 - w) + b.r * w,
    g: a.g * (1 - w) + b.g * w,
    b: a.b * (1 - w) + b.b * w,
  };
}

function lightenRgb(rgb: Rgb, amount: number): Rgb {
  return {
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount,
  };
}

function colorsEqual(a: BrandColors, b: BrandColors): boolean {
  return BRAND_PALETTE_COLOR_KEYS.every(
    (key) => a[key].toUpperCase() === b[key].toUpperCase(),
  );
}

export function deriveDarkBrandColors(light: BrandColors): BrandColors {
  if (colorsEqual(light, DEFAULT_BRAND_COLORS)) {
    return { ...DEFAULT_DARK_BRAND_COLORS };
  }

  const pineBase = hexToRgb(light.pine);
  const pineDarkBase = hexToRgb(light.pineDark);
  const pine = rgbToHex(lightenRgb(pineBase, 0.42));
  const pineDark = rgbToHex(lightenRgb(pineDarkBase, 0.32));
  const mint = rgbToHex(mixRgb(hexToRgb("#2A3A38"), pineBase, 0.28));
  const mintSoft = rgbToHex(mixRgb(hexToRgb("#1F2423"), pineBase, 0.22));
  return {
    pine,
    pineDark,
    mint,
    mintSoft,
    mintDeep: pine,
    ...(light.accent ? { accent: light.accent } : {}),
  };
}

export function hexToRgbTriplet(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

function cssVarsBlock(selector: string, colors: BrandColors): string {
  const entries = [
    ["--pine", colors.pine],
    ["--pine-dark", colors.pineDark],
    ["--mint", colors.mint],
    ["--mint-soft", colors.mintSoft],
    ["--mint-deep", colors.mintDeep],
    ["--accent", colors.accent ?? colors.pine],
    ["--accent-deep", colors.pineDark],
    ["--accent-soft", colors.mintSoft],
    ["--focus", colors.pine],
  ]
    .map(([name, hex]) => `${name}: ${hexToRgbTriplet(hex)};`)
    .join("\n  ");
  return `${selector} {\n  ${entries}\n}`;
}

/** Runtime CSS injected in layout — overrides :root brand tokens. */
export function buildBrandThemeCss(raw?: Partial<BrandColors> | null): string {
  const light = mergeBrandColors(raw);
  const dark = deriveDarkBrandColors(light);
  return [cssVarsBlock(":root", light), cssVarsBlock(".dark", dark)].join("\n");
}

export function resolveBrandColorsFromPalette(
  paletteId?: string | null,
  override?: Partial<BrandColors> | null,
): BrandColors {
  const palette = getBrandPalette(paletteId ?? DEFAULT_BRAND_PALETTE_ID);
  return mergeBrandColors({ ...palette.colors, ...override });
}
