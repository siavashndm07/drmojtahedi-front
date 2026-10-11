export function validateStaffPassword(
  password: string,
  requireComplexity: boolean,
): string | null {
  if (!password) return "رمز عبور الزامی است.";

  if (!requireComplexity) {
    if (password.length < 8) {
      return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    }
    return null;
  }

  if (password.length < 10) {
    return "رمز پیچیده باید حداقل ۱۰ کاراکتر باشد.";
  }
  if (!/[A-Za-z]/.test(password)) {
    return "رمز پیچیده باید شامل حروف انگلیسی باشد.";
  }
  if (!/[0-9]/.test(password)) {
    return "رمز پیچیده باید شامل عدد باشد.";
  }
  if (password.toLowerCase() === password || password.toUpperCase() === password) {
    return "رمز پیچیده باید ترکیبی از حروف بزرگ و کوچک باشد.";
  }
  return null;
}

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "superuser",
  "superadmin",
  "test",
  "demo",
  "user",
  "staff",
]);

export function validateStaffUsername(username: string): string | null {
  const value = username.trim();
  if (!value) return "نام کاربری الزامی است.";
  if (RESERVED_USERNAMES.has(value.toLowerCase())) {
    return "این نام کاربری رزرو شده است. از نام یکتا استفاده کنید.";
  }
  if (value.length < 3) return "نام کاربری باید حداقل ۳ کاراکتر باشد.";
  return null;
}
