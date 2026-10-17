"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import ImageAssetField from "@/components/ImageAssetField";
import OptionPills from "@/components/OptionPills";
import PageHeader from "@/components/PageHeader";
import {
  Field,
  FormActions,
  FormSection,
  Input,
  TagInput,
  Textarea,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiCreateBook,
  apiDeleteBook,
  apiGetBook,
  apiUpdateBook,
} from "@/lib/api/books";
import {
  BOOK_ITEM_TYPE_OPTIONS,
  PUBLISH_STATUS_OPTIONS,
} from "@/lib/optionSets";
import { slugifyFa } from "@/lib/newsBlocks";
import type { ContentStatus } from "@/lib/api/resources";
import { requireTrimmed } from "@/lib/formValidation";

type FieldErrors = Partial<Record<"title" | "slug" | "itemType" | "cover", string>>;

type FormState = {
  slug: string;
  title: string;
  description: string;
  author: string;
  year: string;
  source: string;
  itemType: string;
  status: ContentStatus;
  cover: string;
  coverImageId: string | null;
  tags: string[];
};

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    description: "",
    author: "",
    year: "",
    source: "",
    itemType: "book",
    status: "published",
    cover: "",
    coverImageId: null,
    tags: [],
  };
}

export default function BooksFormClient({
  mode,
  id,
}: {
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [values, setValues] = useState<FormState>(emptyForm());
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (mode !== "edit" || !id || !accessToken) return;
    let cancelled = false;
    (async () => {
      try {
        const item = await apiGetBook(accessToken, id);
        if (cancelled) return;
        setValues({
          slug: item.slug,
          title: item.title,
          description: item.description ?? "",
          author: item.author ?? "",
          year: item.year ?? "",
          source: item.source ?? "",
          itemType: item.itemType || item.item_type || "book",
          status: item.status,
          cover: item.cover || item.heroImage?.src || "",
          coverImageId: item.coverImageId ?? item.heroImage?.id ?? null,
          tags: Array.isArray(item.tags) ? item.tags : [],
        });
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, id, accessToken]);

  function patch(partial: Partial<FormState>) {
    setValues((prev) => ({ ...prev, ...partial }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      if ("title" in partial) delete next.title;
      if ("slug" in partial) delete next.slug;
      if ("itemType" in partial) delete next.itemType;
      if ("coverImageId" in partial || "cover" in partial) delete next.cover;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    const nextErrors: FieldErrors = {
      title: requireTrimmed(values.title),
      slug: requireTrimmed(values.slug),
      itemType: requireTrimmed(values.itemType, "نوع را انتخاب کنید"),
      cover: values.coverImageId ? undefined : "تصویر کاور الزامی است",
    };
    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setSaving(true);
    try {
      const payload = {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        author: values.author.trim(),
        year: values.year.trim(),
        source: values.source.trim(),
        itemType: values.itemType,
        status: values.status,
        tags: values.tags,
        coverImageId: values.coverImageId,
      };
      if (mode === "edit" && id) {
        await apiUpdateBook(accessToken, id, payload);
        toast.success("کتاب ذخیره شد");
      } else {
        const created = await apiCreateBook(accessToken, payload);
        toast.success("کتاب ایجاد شد");
        router.replace(`/books/${created.id}`);
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!accessToken || !id) return;
    setDeleting(true);
    try {
      await apiDeleteBook(accessToken, id);
      toast.success("حذف شد");
      router.replace("/books");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-muted">
        <Loader2 className="me-2 h-4 w-4 animate-spin" />
        در حال بارگذاری…
      </div>
    );
  }

  if (notFound) {
    return (
      <div>
        <PageHeader title="کتاب یافت نشد" />
        <Link href="/books" className="btn-secondary inline-flex">
          بازگشت به فهرست
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={mode === "edit" ? "ویرایش کتاب" : "کتاب جدید"}
        description="منابع کتابخانه — در سایت روی /library نمایش داده می‌شود."
        action={
          <Link href="/books" className="btn-secondary !gap-1.5 !py-2 text-xs">
            <ArrowRight className="h-3.5 w-3.5" />
            فهرست کتاب‌ها
          </Link>
        }
      />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormSection title="اطلاعات اصلی" description="عنوان، نویسنده و مشخصات انتشار.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="عنوان"
              htmlFor="book-title"
              className="sm:col-span-2"
              error={fieldErrors.title}
            >
              <Input
                id="book-title"
                value={values.title}
                error={!!fieldErrors.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patch({
                    title,
                    slug: slugTouched ? values.slug : slugifyFa(title),
                  });
                }}
              />
            </Field>
            <Field label="اسلاگ" htmlFor="book-slug" error={fieldErrors.slug}>
              <Input
                id="book-slug"
                value={values.slug}
                error={!!fieldErrors.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch({ slug: e.target.value });
                }}
                dir="ltr"
                className="text-start"
              />
            </Field>
            <Field label="نویسنده / گردآورنده" htmlFor="book-author">
              <Input
                id="book-author"
                value={values.author}
                onChange={(e) => patch({ author: e.target.value })}
              />
            </Field>
            <Field label="سال / چاپ" htmlFor="book-year">
              <Input
                id="book-year"
                value={values.year}
                onChange={(e) => patch({ year: e.target.value })}
                placeholder="مثلاً چاپ ششم · ۱۴۰۳"
              />
            </Field>
            <Field label="منبع" htmlFor="book-source">
              <Input
                id="book-source"
                value={values.source}
                onChange={(e) => patch({ source: e.target.value })}
              />
            </Field>
            <Field
              label="توضیح"
              htmlFor="book-description"
              className="sm:col-span-2"
              hint="در فهرست و صفحهٔ جزئیات سایت نمایش داده می‌شود."
            >
              <Textarea
                id="book-description"
                value={values.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={4}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="کاور" description="تصویر جلد برای کارت فهرست و صفحهٔ کتاب.">
          <ImageAssetField
            label="تصویر کاور"
            kind="articles"
            imageId={values.coverImageId}
            imageUrl={values.cover}
            aspectClass="aspect-[3/4]"
            previewClassName="max-w-[11rem]"
            error={fieldErrors.cover}
            onChange={({ id, url }) => patch({ coverImageId: id, cover: url })}
          />
        </FormSection>

        <FormSection title="نوع و انتشار">
          <OptionPills
            label="نوع منبع"
            value={values.itemType}
            options={BOOK_ITEM_TYPE_OPTIONS}
            columns={3}
            error={fieldErrors.itemType}
            onChange={(itemType) => patch({ itemType })}
          />
          <OptionPills
            label="وضعیت انتشار"
            value={values.status}
            options={PUBLISH_STATUS_OPTIONS}
            columns={3}
            onChange={(status) => patch({ status: status as ContentStatus })}
          />
          <Field
            label="برچسب‌ها"
            htmlFor="book-tags"
            hint="هر برچسب را بنویسید و Enter بزنید."
          >
            <TagInput
              id="book-tags"
              value={values.tags ?? []}
              onChange={(tags) => patch({ tags })}
            />
          </Field>
        </FormSection>

        <FormActions>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "edit" ? "ذخیره تغییرات" : "ایجاد کتاب"}
          </button>
          <Link href="/books" className="btn-secondary">
            انصراف
          </Link>
          {mode === "edit" ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          ) : null}
        </FormActions>
      </form>

      <ConfirmDialog
        open={deleteOpen}
        title="حذف این کتاب؟"
        description="پس از حذف قابل بازگشت نیست."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => {
          if (!deleting) setDeleteOpen(false);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
