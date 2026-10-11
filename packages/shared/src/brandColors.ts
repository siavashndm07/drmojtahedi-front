export type BrandColors = {
  pine: string;
  pineDark: string;
  mint: string;
  mintSoft: string;
  mintDeep: string;
  /** Optional second accent for badges, offers, highlights */
  accent?: string;
  /** Store page (html/body) background — solid or gradient */
  bodyBackground?: BodyBackground;
};

export type BrandColorKey = keyof BrandColors;

export type BodyBackgroundMode = "solid" | "gradient";

export type BodyBackground = {
  mode: BodyBackgroundMode;
  /** Primary / start color */
  color: string;
  /** End color when mode is gradient */
  colorEnd: string;
  /** Gradient angle in degrees (CSS linear-gradient) */
  angle: number;
};

export const DEFAULT_BODY_BACKGROUND: BodyBackground = {
  mode: "solid",
  color: "#F9F6F3",
  colorEnd: "#F0F7F6",
  angle: 165,
};

export const BRAND_COLOR_KEYS: BrandColorKey[] = [
  "pine",
  "pineDark",
  "mint",
  "mintSoft",
  "mintDeep",
  "accent",
];

/** Palette keys only — excludes accent and bodyBackground */
export const BRAND_PALETTE_COLOR_KEYS = [
  "pine",
  "pineDark",
  "mint",
  "mintSoft",
  "mintDeep",
] as const satisfies ReadonlyArray<Exclude<BrandColorKey, "accent" | "bodyBackground">>;

export const DEFAULT_BRAND_COLORS: BrandColors = {
  pine: "#2F7F78",
  pineDark: "#246661",
  mint: "#D8EDEB",
  mintSoft: "#F0F7F6",
  mintDeep: "#2F7F78",
  bodyBackground: { ...DEFAULT_BODY_BACKGROUND },
};

export type BrandColorPalette = {
  id: string;
  label: string;
  description: string;
  colors: BrandColors;
};

export const BRAND_COLOR_PALETTES: BrandColorPalette[] = [
  {
    id: "sensiblecool",
    label: "مینت",
    description: "سبز آبی آرام — پیش‌فرض بنیاد",
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
    id: "emerald",
    label: "زمرد",
    description: "تازه و طبیعی — مناسب مراقبت پوست",
    colors: {
      pine: "#059669",
      pineDark: "#047857",
      mint: "#D1FAE5",
      mintSoft: "#ECFDF5",
      mintDeep: "#059669",
    },
  },

  {
    id: "ocean",
    label: "اقیانوس",
    description: "آبی روشن و تمیز — حس اعتماد",
    colors: {
      pine: "#0284C7",
      pineDark: "#0369A1",
      mint: "#E0F2FE",
      mintSoft: "#F0F9FF",
      mintDeep: "#0284C7",
    },
  },

  {
    id: "sky",
    label: "آسمان",
    description: "آبی ملایم — روشن، مدرن و دوستانه",
    colors: {
      pine: "#0EA5E9",
      pineDark: "#0284C7",
      mint: "#E0F2FE",
      mintSoft: "#F0F9FF",
      mintDeep: "#0EA5E9",
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

  {
    id: "forest",
    label: "جنگلی",
    description: "سبز عمیق — طبیعی، اصیل و حرفه‌ای",
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
    description: "سبز خاکی — مینیمال و طبیعی",
    colors: {
      pine: "#5F7A61",
      pineDark: "#4C624E",
      mint: "#E4EDE5",
      mintSoft: "#F2F6F2",
      mintDeep: "#5F7A61",
    },
  },

  {
    id: "olive",
    label: "زیتونی",
    description: "سبز زیتونی — گرم، طبیعی و متفاوت",
    colors: {
      pine: "#6B7A3D",
      pineDark: "#566331",
      mint: "#E9EED7",
      mintSoft: "#F6F8EE",
      mintDeep: "#6B7A3D",
    },
  },

  {
    id: "lavender",
    label: "اسطوخودوس",
    description: "بنفش ملایم — لوکس و آرام",
    colors: {
      pine: "#7C6BA8",
      pineDark: "#65568C",
      mint: "#EDE9F5",
      mintSoft: "#F7F5FB",
      mintDeep: "#7C6BA8",
    },
  },

  {
    id: "violet",
    label: "بنفشه",
    description: "بنفش مدرن — خلاق، ظریف و متمایز",
    colors: {
      pine: "#7C3AED",
      pineDark: "#6D28D9",
      mint: "#EDE9FE",
      mintSoft: "#F5F3FF",
      mintDeep: "#7C3AED",
    },
  },

  {
    id: "indigo",
    label: "نیلی",
    description: "آبی نیلی — حرفه‌ای و قابل اعتماد",
    colors: {
      pine: "#4F46E5",
      pineDark: "#4338CA",
      mint: "#E0E7FF",
      mintSoft: "#EEF2FF",
      mintDeep: "#4F46E5",
    },
  },

  {
    id: "rose",
    label: "رز",
    description: "صورتی شرابی — ظریف و مناسب زیبایی",
    colors: {
      pine: "#BE4A6F",
      pineDark: "#9A3A59",
      mint: "#F9E8EE",
      mintSoft: "#FDF4F7",
      mintDeep: "#BE4A6F",
    },
  },

  {
    id: "berry",
    label: "بری",
    description: "قرمز توت‌فرنگی — جسور و لوکس",
    colors: {
      pine: "#9F1239",
      pineDark: "#881337",
      mint: "#FCE7F3",
      mintSoft: "#FFF1F2",
      mintDeep: "#9F1239",
    },
  },

  {
    id: "plum",
    label: "آلو",
    description: "بنفش عمیق — ظریف و متمایز",
    colors: {
      pine: "#6B4E71",
      pineDark: "#553F59",
      mint: "#EDE7EE",
      mintSoft: "#F6F3F7",
      mintDeep: "#6B4E71",
    },
  },

  {
    id: "mauve",
    label: "موو",
    description: "بنفش صورتی خاکی — ظریف و لوکس",
    colors: {
      pine: "#9B6B82",
      pineDark: "#7D5368",
      mint: "#F3E8ED",
      mintSoft: "#FAF5F7",
      mintDeep: "#9B6B82",
    },
  },

  {
    id: "coral",
    label: "مرجانی",
    description: "گرم و دوستانه — برندهای پرانرژی",
    colors: {
      pine: "#E07A5F",
      pineDark: "#C46850",
      mint: "#FCEEEA",
      mintSoft: "#FDF6F4",
      mintDeep: "#E07A5F",
    },
  },

  {
    id: "terracotta",
    label: "آجری",
    description: "نارنجی خاکی — گرم، طبیعی و خاص",
    colors: {
      pine: "#C65D3B",
      pineDark: "#A84B30",
      mint: "#F5E3DC",
      mintSoft: "#FCF5F2",
      mintDeep: "#C65D3B",
    },
  },

  {
    id: "amber",
    label: "کهربایی",
    description: "طلایی گرم — پرانرژی و دعوت‌کننده",
    colors: {
      pine: "#D97706",
      pineDark: "#B45309",
      mint: "#FEF3C7",
      mintSoft: "#FFFBEB",
      mintDeep: "#D97706",
    },
  },

  {
    id: "champagne",
    label: "شامپاین",
    description: "طلایی کرمی — پریمیوم و گرم",
    colors: {
      pine: "#A67C52",
      pineDark: "#876341",
      mint: "#F3EBE0",
      mintSoft: "#FAF6F1",
      mintDeep: "#A67C52",
    },
  },

  {
    id: "sand",
    label: "شن‌زار",
    description: "بژ گرم — مینیمال و لوکس",
    colors: {
      pine: "#A18468",
      pineDark: "#806650",
      mint: "#EEE5DB",
      mintSoft: "#FAF7F3",
      mintDeep: "#A18468",
    },
  },

  {
    id: "coffee",
    label: "قهوه‌ای",
    description: "قهوه‌ای گرم — کلاسیک و قابل اعتماد",
    colors: {
      pine: "#795548",
      pineDark: "#5D4037",
      mint: "#EFEBE9",
      mintSoft: "#FAF9F8",
      mintDeep: "#795548",
    },
  },

  {
    id: "slate",
    label: "سنگ‌آذر",
    description: "خاکستری-آبی — مدرن و حرفه‌ای",
    colors: {
      pine: "#475569",
      pineDark: "#334155",
      mint: "#E2E8F0",
      mintSoft: "#F1F5F9",
      mintDeep: "#475569",
    },
  },

  {
    id: "graphite",
    label: "گرافیتی",
    description: "خاکستری تیره — مینیمال و تکنولوژیک",
    colors: {
      pine: "#374151",
      pineDark: "#1F2937",
      mint: "#E5E7EB",
      mintSoft: "#F9FAFB",
      mintDeep: "#374151",
    },
  },

  {
    id: "midnight",
    label: "نیمه‌شب",
    description: "سرمه‌ای عمیق — رسمی و پریمیوم",
    colors: {
      pine: "#1E3A5F",
      pineDark: "#172F4D",
      mint: "#DCE7F2",
      mintSoft: "#F3F7FA",
      mintDeep: "#1E3A5F",
    },
  },

  {
    id: "aqua",
    label: "آکوا",
    description: "آبی سبز روشن — خنک و تازه",
    colors: {
      pine: "#0891B2",
      pineDark: "#0E7490",
      mint: "#CFFAFE",
      mintSoft: "#ECFEFF",
      mintDeep: "#0891B2",
    },
  },

  {
    id: "mint",
    label: "نعنا",
    description: "سبز روشن — تازه و آرام",
    colors: {
      pine: "#10B981",
      pineDark: "#059669",
      mint: "#D1FAE5",
      mintSoft: "#ECFDF5",
      mintDeep: "#10B981",
    },
  },
];

export const DEFAULT_DARK_BRAND_COLORS: BrandColors = {
  pine: "#5BBFB7",
  pineDark: "#4AADA5",
  mint: "#2A3A38",
  mintSoft: "#1F2423",
  mintDeep: "#5BBFB7",
  bodyBackground: {
    mode: "solid",
    color: "#141312",
    colorEnd: "#1F2423",
    angle: 165,
  },
};

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!HEX_RE.test(withHash)) return null;
  return withHash.toUpperCase();
}

function clampAngle(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_BODY_BACKGROUND.angle;
  const normalized = ((Math.round(n) % 360) + 360) % 360;
  return normalized;
}

export function mergeBodyBackground(
  raw?: Partial<BodyBackground> | null,
): BodyBackground {
  const merged: BodyBackground = { ...DEFAULT_BODY_BACKGROUND };
  if (!raw || typeof raw !== "object") return merged;
  if (raw.mode === "solid" || raw.mode === "gradient") {
    merged.mode = raw.mode;
  }
  const color = normalizeHex(String(raw.color ?? ""));
  if (color) merged.color = color;
  const colorEnd = normalizeHex(String(raw.colorEnd ?? ""));
  if (colorEnd) merged.colorEnd = colorEnd;
  if (raw.angle != null) merged.angle = clampAngle(raw.angle);
  return merged;
}

export function mergeBrandColors(raw?: Partial<BrandColors> | null): BrandColors {
  const merged: BrandColors = {
    ...DEFAULT_BRAND_COLORS,
    bodyBackground: { ...DEFAULT_BODY_BACKGROUND },
  };
  if (!raw || typeof raw !== "object") return merged;
  for (const key of BRAND_PALETTE_COLOR_KEYS) {
    const normalized = normalizeHex(String(raw[key] ?? ""));
    if (normalized) merged[key] = normalized;
  }
  const accent = normalizeHex(String(raw.accent ?? ""));
  if (accent) merged.accent = accent;
  if (raw.bodyBackground != null || "bodyBackground" in raw) {
    merged.bodyBackground = mergeBodyBackground(
      raw.bodyBackground as Partial<BodyBackground> | null,
    );
  }
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

function darkenRgb(rgb: Rgb, amount: number): Rgb {
  const w = Math.max(0, Math.min(1, amount));
  return {
    r: rgb.r * (1 - w),
    g: rgb.g * (1 - w),
    b: rgb.b * (1 - w),
  };
}

function colorsEqual(a: BrandColors, b: BrandColors): boolean {
  return BRAND_PALETTE_COLOR_KEYS.every(
    (key) => a[key].toUpperCase() === b[key].toUpperCase(),
  );
}

export function isSameBrandColors(a: BrandColors, b: BrandColors): boolean {
  return colorsEqual(a, b);
}

export function deriveDarkBrandColors(light: BrandColors): BrandColors {
  const body = mergeBodyBackground(light.bodyBackground);
  const darkBody: BodyBackground = {
    mode: body.mode,
    color: rgbToHex(darkenRgb(hexToRgb(body.color), 0.82)),
    colorEnd: rgbToHex(darkenRgb(hexToRgb(body.colorEnd), 0.78)),
    angle: body.angle,
  };

  if (colorsEqual(light, DEFAULT_BRAND_COLORS)) {
    return {
      ...DEFAULT_DARK_BRAND_COLORS,
      bodyBackground: darkBody,
    };
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
    bodyBackground: darkBody,
  };
}

export function hexToRgbTriplet(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

export function bodyBackgroundCssValue(bg: BodyBackground): string {
  const resolved = mergeBodyBackground(bg);
  if (resolved.mode === "gradient") {
    return `linear-gradient(${resolved.angle}deg, ${resolved.color}, ${resolved.colorEnd})`;
  }
  return resolved.color;
}

function bodyBackgroundRules(bg: BodyBackground): string {
  const resolved = mergeBodyBackground(bg);
  const cream = hexToRgbTriplet(resolved.color);
  if (resolved.mode === "gradient") {
    const value = bodyBackgroundCssValue(resolved);
    return [
      `--cream: ${cream};`,
      `--body-bg: ${value};`,
      `background-color: ${resolved.color};`,
      `background-image: ${value};`,
      `background-attachment: fixed;`,
    ].join("\n  ");
  }
  return [
    `--cream: ${cream};`,
    `--body-bg: ${resolved.color};`,
    `background-color: ${resolved.color};`,
    `background-image: none;`,
    `background-attachment: scroll;`,
  ].join("\n  ");
}

function cssVarsBlock(selector: string, colors: BrandColors): string {
  const entries = [
    ["--pine", colors.pine],
    ["--pine-dark", colors.pineDark],
    ["--mint", colors.mint],
    ["--mint-soft", colors.mintSoft],
    ["--mint-deep", colors.mintDeep],
    ...(colors.accent ? [["--accent", colors.accent] as const] : []),
  ]
    .map(([name, hex]) => `${name}: ${hexToRgbTriplet(hex)};`)
    .join("\n  ");
  return `${selector} {\n  ${entries}\n}`;
}

export function buildBrandThemeCss(raw?: Partial<BrandColors> | null): string {
  const light = mergeBrandColors(raw);
  const dark = deriveDarkBrandColors(light);
  const lightBody = mergeBodyBackground(light.bodyBackground);
  const darkBody = mergeBodyBackground(dark.bodyBackground);
  return [
    cssVarsBlock(":root", light),
    `html {\n  ${bodyBackgroundRules(lightBody)}\n}`,
    `body {\n  background-color: transparent;\n  background-image: none;\n}`,
    cssVarsBlock(".dark", dark),
    `.dark {\n  ${bodyBackgroundRules(darkBody)}\n}`,
  ].join("\n");
}

export function brandColorsScopeCss(
  scopeSelector: string,
  raw?: Partial<BrandColors> | null,
): string {
  const colors = mergeBrandColors(raw);
  const body = mergeBodyBackground(colors.bodyBackground);
  return `${cssVarsBlock(scopeSelector, colors)}\n${scopeSelector} {\n  ${bodyBackgroundRules(body)}\n}`;
}


export const DEFAULT_BRAND_PALETTE_ID = "sensiblecool";

export function getBrandPalette(id?: string | null): BrandColorPalette {
  const match = BRAND_COLOR_PALETTES.find((p) => p.id === id);
  return match ?? BRAND_COLOR_PALETTES[0];
}

export function resolveBrandColorsFromPalette(
  paletteId?: string | null,
  override?: Partial<BrandColors> | null,
): BrandColors {
  const palette = getBrandPalette(paletteId ?? DEFAULT_BRAND_PALETTE_ID);
  return mergeBrandColors({ ...palette.colors, ...override });
}
