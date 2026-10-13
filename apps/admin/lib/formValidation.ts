export const REQUIRED_FIELD = "این فیلد الزامی است.";

export function requireTrimmed(
  value: string | null | undefined,
  message = REQUIRED_FIELD,
): string | undefined {
  return value?.trim() ? undefined : message;
}

export function firstError(
  errors: Record<string, string | undefined>,
): string | undefined {
  return Object.values(errors).find(Boolean);
}
