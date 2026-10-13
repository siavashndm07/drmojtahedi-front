"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  BookOpen,
  Building2,
  HandHeart,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Mail,
  Settings,
  ShieldCheck,
  User,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Checkbox, Field, Input } from "@/components/form";
import type { AdminStaff } from "@/lib/api/settings";
import { toPersianDigits } from "@/lib/digits";
import { validateStaffPassword, validateStaffUsername } from "@/lib/staffPassword";
import {
  STAFF_PERMISSION_KEYS,
  STAFF_PERMISSION_LABELS,
  type StaffPermissionKey,
} from "@/lib/staffPermissions";

const PERMISSION_ICONS: Record<StaffPermissionKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  content: BookOpen,
  heritage: Users,
  archive: Archive,
  foundation: Building2,
  engagement: HandHeart,
  settings: Settings,
};

type Props = {
  open: boolean;
  staff?: AdminStaff | null;
  canAssignSuperuser?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    username?: string;
    password?: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperuser: boolean;
    permissions: string[];
    requirePasswordComplexity: boolean;
    isActive?: boolean;
  }) => Promise<void>;
  isSelf?: boolean;
};

export default function StaffFormDialog({
  open,
  staff,
  canAssignSuperuser = false,
  onClose,
  onSubmit,
  isSelf = false,
}: Props) {
  const isEdit = Boolean(staff);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [requirePasswordComplexity, setRequirePasswordComplexity] = useState(true);
  const [email, setEmail] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<StaffPermissionKey[]>([
    ...STAFF_PERMISSION_KEYS,
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
    passwordConfirm?: string;
    permissions?: string;
  }>({});

  useEffect(() => {
    if (!open) return;
    setUsername(staff?.username ?? "");
    setFirstName(staff?.firstName ?? "");
    setLastName(staff?.lastName ?? "");
    setPassword("");
    setPasswordConfirm("");
    setRequirePasswordComplexity(true);
    setEmail(staff?.email ?? "");
    setIsSuperuser(Boolean(staff?.isSuperuser));
    setIsActive(staff ? staff.isActive !== false : true);
    const existing = (staff?.permissions ?? []).filter((k): k is StaffPermissionKey =>
      (STAFF_PERMISSION_KEYS as string[]).includes(k),
    );
    setPermissions(
      staff
        ? existing.length
          ? existing
          : staff.isSuperuser
            ? [...STAFF_PERMISSION_KEYS]
            : []
        : [...STAFF_PERMISSION_KEYS],
    );
    setError(null);
    setFieldErrors({});
  }, [open, staff]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, saving]);

  function togglePermission(key: StaffPermissionKey) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof fieldErrors = {};
    if (!isEdit) {
      if (!username.trim()) nextErrors.username = "این فیلد الزامی است.";
      else {
        const usernameError = validateStaffUsername(username);
        if (usernameError) nextErrors.username = usernameError;
      }
      if (!password) nextErrors.password = "این فیلد الزامی است.";
      if (!passwordConfirm) nextErrors.passwordConfirm = "این فیلد الزامی است.";
    }
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        nextErrors.passwordConfirm = "رمز عبور و تکرار آن یکسان نیست.";
      } else if (password) {
        const passwordError = validateStaffPassword(password, requirePasswordComplexity);
        if (passwordError) nextErrors.password = passwordError;
      }
    }
    if (!isSuperuser && permissions.length === 0) {
      nextErrors.permissions = "حداقل یک بخش دسترسی را انتخاب کنید.";
    }
    setFieldErrors(nextErrors);
    setError(null);
    if (Object.values(nextErrors).some(Boolean)) return;
    setSaving(true);
    try {
      await onSubmit({
        username: isEdit ? undefined : username.trim(),
        password: password || undefined,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isSuperuser,
        permissions: isSuperuser ? [] : permissions,
        requirePasswordComplexity,
        ...(isEdit ? { isActive } : {}),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
        onClick={() => !saving && onClose()}
        aria-label="بستن"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-form-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div>
            <h2 id="staff-form-title" className="text-base font-bold text-ink">
              {isEdit ? "ویرایش کاربر پنل" : "کاربر جدید پنل"}
            </h2>
            <p className="mt-1 text-xs leading-6 text-ink-muted">
              {isEdit
                ? "نام و سطح دسترسی این حساب را به‌روز کنید."
                : "حساب staff برای ورود به پنل بسازید و بخش‌های مجاز را مشخص کنید."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-muted transition hover:bg-cream disabled:opacity-60"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <section className="rounded-2xl border border-ink/10 bg-cream/30 p-4 dark:bg-cream/10">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="نام" htmlFor="staff-first-name">
                  <Input
                    id="staff-first-name"
                    value={firstName}
                    placeholder="مثلاً سیاوش"
                    icon={<UserRound className="h-4 w-4" aria-hidden />}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Field>
                <Field label="نام خانوادگی" htmlFor="staff-last-name">
                  <Input
                    id="staff-last-name"
                    value={lastName}
                    placeholder="مثلاً نادری"
                    icon={<UserRound className="h-4 w-4" aria-hidden />}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Field>
                <Field label="ایمیل" htmlFor="staff-email" className="sm:col-span-2">
                  <Input
                    id="staff-email"
                    type="email"
                    value={email}
                    dir="ltr"
                    className="text-start"
                    icon={<Mail className="h-4 w-4" aria-hidden />}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold text-ink-muted">حساب ورود</p>
              <Field
                label="نام کاربری"
                htmlFor="staff-user"
                error={fieldErrors.username}
              >
                <Input
                  id="staff-user"
                  value={username}
                  error={!!fieldErrors.username}
                  disabled={isEdit}
                  dir="ltr"
                  className="text-start"
                  icon={<User className="h-4 w-4" aria-hidden />}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label={isEdit ? "رمز جدید (اختیاری)" : "رمز عبور"}
                  htmlFor="staff-pass"
                  error={fieldErrors.password}
                  hint={
                    fieldErrors.password
                      ? undefined
                      : requirePasswordComplexity
                        ? "حداقل ۱۰ کاراکتر، حروف بزرگ و کوچک و عدد"
                        : "حداقل ۸ کاراکتر"
                  }
                >
                  <Input
                    id="staff-pass"
                    type="password"
                    value={password}
                    error={!!fieldErrors.password}
                    dir="ltr"
                    className="text-start"
                    icon={<KeyRound className="h-4 w-4" aria-hidden />}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    autoComplete="new-password"
                  />
                </Field>
                <Field
                  label={isEdit ? "تکرار رمز جدید" : "تکرار رمز عبور"}
                  htmlFor="staff-pass-confirm"
                  error={fieldErrors.passwordConfirm}
                >
                  <Input
                    id="staff-pass-confirm"
                    type="password"
                    value={passwordConfirm}
                    error={!!fieldErrors.passwordConfirm}
                    dir="ltr"
                    className="text-start"
                    icon={<KeyRound className="h-4 w-4" aria-hidden />}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        passwordConfirm: undefined,
                      }));
                    }}
                    autoComplete="new-password"
                  />
                </Field>
              </div>
              <Checkbox
                id="staff-pass-complexity"
                label="الزام پیچیدگی رمز"
                description="رمز باید شامل حروف بزرگ و کوچک انگلیسی و عدد باشد."
                checked={requirePasswordComplexity}
                onChange={(e) => setRequirePasswordComplexity(e.target.checked)}
              />
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold text-ink-muted">دسترسی پنل</p>
              {isEdit ? (
                <Checkbox
                  id="staff-active"
                  variant="card"
                  label="حساب فعال"
                  description={
                    isSelf
                      ? "نمی‌توانید حساب خودتان را غیرفعال کنید."
                      : "اگر خاموش باشد، این کاربر نمی‌تواند وارد پنل شود."
                  }
                  checked={isActive}
                  disabled={isSelf}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              ) : null}
              {canAssignSuperuser ? (
                <Checkbox
                  id="staff-super"
                  variant="card"
                  label={
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-pine" aria-hidden />
                      ابرکاربر
                    </span>
                  }
                  description="دسترسی کامل به همه بخش‌های پنل، بدون محدودیت."
                  checked={isSuperuser}
                  onChange={(e) => setIsSuperuser(e.target.checked)}
                />
              ) : null}
              {isSuperuser ? (
                <p className="rounded-xl bg-pine/10 px-3.5 py-3 text-xs leading-6 text-pine">
                  این کاربر به همه منوها دسترسی دارد.
                </p>
              ) : (
                <div
                  className={`space-y-2 rounded-2xl ${
                    fieldErrors.permissions ? "ring-2 ring-red-400/70" : ""
                  }`}
                >
                  <p className="text-xs text-ink-muted">
                    {toPersianDigits(permissions.length)} بخش انتخاب شده — فقط همین
                    بخش‌ها در منو دیده می‌شود.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {STAFF_PERMISSION_KEYS.map((key) => {
                      const Icon = PERMISSION_ICONS[key];
                      return (
                        <Checkbox
                          key={key}
                          id={`staff-perm-${key}`}
                          variant="card"
                          label={
                            <span className="inline-flex items-center gap-2">
                              <Icon className="h-4 w-4 text-pine" aria-hidden />
                              {STAFF_PERMISSION_LABELS[key]}
                            </span>
                          }
                          checked={permissions.includes(key)}
                          onChange={() => {
                            togglePermission(key);
                            setFieldErrors((prev) => ({
                              ...prev,
                              permissions: undefined,
                            }));
                          }}
                        />
                      );
                    })}
                  </div>
                  {fieldErrors.permissions ? (
                    <p className="text-xs font-medium text-red-600" role="alert">
                      {fieldErrors.permissions}
                    </p>
                  ) : null}
                </div>
              )}
            </section>
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <p className="hidden text-xs text-ink-muted sm:block">
                سطح دسترسی، منوهای قابل‌مشاهده در پنل را مشخص می‌کند.
              </p>
            )}
            <div className="flex flex-col-reverse gap-2 sm:ms-auto sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="btn-secondary disabled:opacity-60"
              >
                انصراف
              </button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {isEdit ? "ذخیره تغییرات" : "ایجاد کاربر"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
