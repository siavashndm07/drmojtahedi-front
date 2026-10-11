export const DONATE_TARGETS = [
  {
    id: "schools",
    title: "مدارس بنیاد",
    description: "ساخت و بهره‌برداری از مدارس",
  },
  {
    id: "entrepreneurship",
    title: "مراکز کارآفرینی",
    description: "ساخت، تجهیز و بهره‌برداری",
  },
  {
    id: "training",
    title: "آموزش نیروی انسانی",
    description: "امور آموزش و تربیت",
  },
  {
    id: "students",
    title: "دانش‌آموزان نیازمند",
    description: "کمک به خانواده‌های نیازمند",
  },
  {
    id: "jobs",
    title: "اشتغال مناطق محروم",
    description: "ایجاد اشتغال و کارآفرینی",
  },
  {
    id: "general",
    title: "کمک عام",
    description: "هزینه به تشخیص بنیاد",
  },
] as const;

export const DONATE_AMOUNT_PRESETS = [
  1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000,
] as const;

export const DONATE_MIN_RIALS = 10_000;

export const DONATE_MESSAGE =
  "حمایت شما صرف برنامه‌های فرهنگی و عام‌المنفعهٔ بنیاد می‌شود.";

export const PAYMENT_BANKS = [
  {
    id: "pasargad",
    name: "بانک پاسارگاد",
    description: "پرداخت آنی و امن",
  },
  {
    id: "tejarat",
    name: "بانک تجارت",
    description: "پرداخت آنی و امن",
  },
] as const;

export function formatRials(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatToman(rials: number): string {
  return Math.floor(rials / 10).toLocaleString("en-US");
}
