"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import ActionIconButton from "@/components/ActionIconButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import StaffFormDialog from "@/components/StaffFormDialog";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  createStaff,
  deactivateStaff,
  getStaff,
  updateStaff,
  type AdminStaff,
} from "@/lib/api/settings";
import { toPersianDigits } from "@/lib/digits";
import {
  STAFF_PERMISSION_KEYS,
  STAFF_PERMISSION_LABELS,
  type StaffPermissionKey,
} from "@/lib/staffPermissions";

type StatusFilter = "all" | "active" | "inactive";

function grantedPermissions(item: AdminStaff): StaffPermissionKey[] {
  if (item.isSuperuser) return [...STAFF_PERMISSION_KEYS];
  const allowed = new Set(item.permissions ?? []);
  return STAFF_PERMISSION_KEYS.filter((key) => allowed.has(key));
}

export default function StaffClient() {
  const { user, accessToken } = useAuth();
  const [items, setItems] = useState<AdminStaff[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminStaff | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminStaff | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  async function reload() {
    if (!accessToken) return;
    const list = await getStaff(accessToken);
    setItems(list);
  }

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getStaff(accessToken);
        if (!cancelled) {
          setItems(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const statusCounts = useMemo(
    () => ({
      all: items.length,
      active: items.filter((i) => i.isActive).length,
      inactive: items.filter((i) => !i.isActive).length,
    }),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter === "active" && !item.isActive) return false;
      if (statusFilter === "inactive" && item.isActive) return false;
      if (!q) return true;
      return (
        item.username.toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q)
      );
    });
  }, [items, query, statusFilter]);

  return (
    <div>
      <PageHeader
        title="کاربران پنل"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} کاربر${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/settings" className="btn-secondary !gap-1.5 !py-2 text-xs">
              <ArrowRight className="h-3.5 w-3.5" />
              تنظیمات سایت
            </Link>
            <button
              type="button"
              className="btn-primary !gap-1.5 !py-2 text-xs"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              کاربر جدید
            </button>
          </div>
        }
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام کاربری یا ایمیل…"
          />
        </div>
        <FilterPills
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
          options={[
            { value: "all", label: "همه", count: statusCounts.all },
            { value: "active", label: "فعال", count: statusCounts.active, icon: UserCheck },
            { value: "inactive", label: "غیرفعال", count: statusCounts.inactive },
          ]}
        />
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 px-5 py-10 text-center text-sm text-ink-muted">
            کاربری نیست — یک کاربر پنل بسازید.
          </li>
        ) : (
          filtered.map((item) => {
            const perms = grantedPermissions(item);
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-ink/10 bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-ink">{item.displayName}</h2>
                      <span className="rounded-full bg-cream px-2 py-0.5 font-mono text-[11px] text-ink-muted" dir="ltr">
                        {item.username}
                      </span>
                      {item.isSuperuser ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[11px] text-pine">
                          <ShieldCheck className="h-3 w-3" />
                          ابرکاربر
                        </span>
                      ) : null}
                      {!item.isActive ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                          غیرفعال
                        </span>
                      ) : null}
                    </div>
                    {item.email ? (
                      <p className="mt-1 text-xs text-ink-muted" dir="ltr">
                        {item.email}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {perms.map((key) => (
                        <span
                          key={key}
                          className="rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-muted"
                        >
                          {STAFF_PERMISSION_LABELS[key]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ActionIconButton
                      label="ویرایش"
                      variant="primary"
                      onClick={() => {
                        setEditing(item);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </ActionIconButton>
                    {item.isActive && item.username !== user?.username ? (
                      <ActionIconButton
                        label="غیرفعال"
                        onClick={() => setDeactivateTarget(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </ActionIconButton>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <StaffFormDialog
        open={formOpen}
        staff={editing}
        canAssignSuperuser={Boolean(user?.isSuperuser)}
        isSelf={editing?.username === user?.username}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={async (payload) => {
          if (!accessToken) throw new Error("وارد پنل نشده‌اید.");
          if (editing) {
            await updateStaff(accessToken, editing.id, payload);
            toast.success("کاربر به‌روز شد");
          } else {
            await createStaff(accessToken, {
              username: payload.username!,
              password: payload.password!,
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              isSuperuser: payload.isSuperuser,
              permissions: payload.permissions,
              requirePasswordComplexity: payload.requirePasswordComplexity,
            });
            toast.success("کاربر ایجاد شد");
          }
          await reload();
        }}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        title="غیرفعال کردن کاربر؟"
        description={
          deactivateTarget
            ? `حساب «${deactivateTarget.displayName}» غیرفعال می‌شود.`
            : ""
        }
        confirmLabel="غیرفعال"
        loading={deactivating}
        onClose={() => {
          if (!deactivating) setDeactivateTarget(null);
        }}
        onConfirm={() => {
          void (async () => {
            if (!accessToken || !deactivateTarget) return;
            setDeactivating(true);
            try {
              await deactivateStaff(accessToken, deactivateTarget.id);
              toast.success("کاربر غیرفعال شد");
              setDeactivateTarget(null);
              await reload();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "عملیات ناموفق");
            } finally {
              setDeactivating(false);
            }
          })();
        }}
      />
    </div>
  );
}
