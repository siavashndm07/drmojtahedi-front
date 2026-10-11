/** Convert Latin digits to Persian numerals for UI display. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

/** Convert Persian/Arabic digits to Latin for validation and APIs. */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

/** Pad index for chapter labels, e.g. 1 → ۰۱ */
export function toPersianIndex(value: number, digits = 2): string {
  return toPersianDigits(String(value).padStart(digits, "0"));
}
