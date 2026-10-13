"use client";

import { useEffect, useMemo, useState } from "react";
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
  NewsBodyEditor,
  PersianDatePicker,
  TagInput,
  Textarea,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiCreateNews,
  apiDeleteNews,
  apiGetNews,
  apiListNewsCategories,
  apiUpdateNews,
  type AdminNewsCategory,
} from "@/lib/api/news";
import { PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";
import {
  blocksToPlainBody,
  emptyNewsBlock,
  normalizeNewsBlocks,
  slugifyFa,
  type NewsBodyBlock,
} from "@/lib/newsBlocks";
import type { ContentStatus } from "@/lib/api/resources";
import { requireTrimmed } from "@/lib/formValidation";
import { FolderOpen, Tag } from "lucide-react";

type FieldErrors = Partial<
  Record<"title" | "slug" | "category" | "cover" | "dateLabel", string>
>;

type FormState = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ContentStatus;
  author: string;
  dateLabel: string;
  publishedAt: string;
  cover: string;
  coverImageId: string | null;
  tags: string[];
  blocks: NewsBodyBlock[];
};

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    description: "",
    category: "",
    status: "published",
    author: "",
    dateLabel: "",
    publishedAt: "",
    cover: "",
    coverImageId: null,
    tags: [],
    blocks: [emptyNewsBlock()],
  };
}

export default function NewsFormClient({
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
  const [categories, setCategories] = useState<AdminNewsCategory[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((c) => c.isActive !== false && c.is_active !== false)
        .map((c) => ({
          value: c.title,
          label: c.title,
          icon: Tag,
          hint: c.slug,
        })),
    [categories],
  );

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await apiListNewsCategories(accessToken);
        if (!cancelled) setCategories(list);
      } catch {
        /* form still works */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    if (mode !== "edit" || !id || !accessToken) return;
    let cancelled = false;
    (async () => {
      try {
        const item = await apiGetNews(accessToken, id);
        if (cancelled) return;
        const blocks = normalizeNewsBlocks(item.blocks?.length ? item.blocks : item.body);
        setValues({
          slug: item.slug,
          title: item.title,
          description: item.description ?? "",
          category: item.category ?? "",
          status: item.status,
          author: item.author ?? "",
          dateLabel: item.dateLabel || item.date_label || "",
          publishedAt: (item.publishedAt || item.published_at || "").slice(0, 16),
          cover: item.cover || item.heroImage?.src || "",
          coverImageId: item.coverImageId ?? item.heroImage?.id ?? null,
          tags: Array.isArray(item.tags) ? item.tags : [],
          blocks: blocks.length ? blocks : [emptyNewsBlock()],
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
      if ("category" in partial) delete next.category;
      if ("coverImageId" in partial || "cover" in partial) delete next.cover;
      if ("dateLabel" in partial) delete next.dateLabel;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    const nextErrors: FieldErrors = {
      title: requireTrimmed(values.title),
      slug: requireTrimmed(values.slug),
      category: requireTrimmed(values.category, "دسته را انتخاب کنید"),
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
        category: values.category.trim(),
        status: values.status,
        author: values.author.trim(),
        dateLabel: values.dateLabel.trim(),
        publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
        coverImageId: values.coverImageId,
        tags: values.tags,
        blocks: values.blocks,
        body: blocksToPlainBody(values.blocks),
      };
      if (mode === "edit" && id) {
        await apiUpdateNews(accessToken, id, payload);
        toast.success("خبر ذخیره شد");
      } else {
        const created = await apiCreateNews(accessToken, payload);
        toast.success("خبر ایجاد شد");
        router.replace(`/news/${created.id}`);
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
      await apiDeleteNews(accessToken, id);
      toast.success("حذف شد");
      router.replace("/news");
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
        <PageHeader title="خبر یافت نشد" />
        <Link href="/news" className="btn-secondary inline-flex">
          بازگشت به فهرست
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={mode === "edit" ? "ویرایش خبر" : "خبر جدید"}
        description="بدنه بلوکی مثل مقالات بینا — پاراگراف، عنوان، تصویر، فهرست و…"
        action={
          <Link href="/news" className="btn-secondary !gap-1.5 !py-2 text-xs">
            <ArrowRight className="h-3.5 w-3.5" />
            فهرست اخبار
          </Link>
        }
      />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormSection title="اطلاعات اصلی" description="عنوان، اسلاگ و خلاصهٔ کوتاه.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="عنوان"
              htmlFor="news-title"
              className="sm:col-span-2"
              error={fieldErrors.title}
            >
              <Input
                id="news-title"
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
            <Field label="اسلاگ" htmlFor="news-slug" error={fieldErrors.slug}>
              <Input
                id="news-slug"
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
            <Field label="نویسنده" htmlFor="news-author">
              <Input
                id="news-author"
                value={values.author}
                onChange={(e) => patch({ author: e.target.value })}
              />
            </Field>
            <Field
              label="خلاصه"
              htmlFor="news-description"
              className="sm:col-span-2"
              hint="در کارت فهرست و سئو نمایش داده می‌شود."
            >
              <Textarea
                id="news-description"
                value={values.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={3}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="کاور"
          description="تصویر شاخص خبر — در فهرست و صفحهٔ جزئیات نمایش داده می‌شود."
        >
          <ImageAssetField
            label="تصویر کاور"
            kind="news"
            imageId={values.coverImageId}
            imageUrl={values.cover}
            aspectClass="aspect-[16/10]"
            previewClassName="max-w-xs"
            error={fieldErrors.cover}
            onChange={({ id, url }) => patch({ coverImageId: id, cover: url })}
          />
        </FormSection>

        <FormSection
          title="دسته و انتشار"
          description="دسته از فهرست مدیریت‌شده انتخاب می‌شود؛ تاریخ انتشار جدا از وضعیت است."
        >
          {categoryOptions.length ? (
            <OptionPills
              label="دسته"
              value={values.category}
              options={categoryOptions}
              columns={2}
              error={fieldErrors.category}
              onChange={(category) => patch({ category })}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-mint-soft/30 px-4 py-5 text-sm text-ink-muted dark:bg-mint/20">
              هنوز دسته‌ای تعریف نشده.{" "}
              <Link href="/news/categories" className="font-semibold text-pine hover:underline">
                مدیریت دسته‌ها
              </Link>
            </div>
          )}

          <OptionPills
            label="وضعیت انتشار"
            value={values.status}
            options={PUBLISH_STATUS_OPTIONS}
            columns={3}
            onChange={(status) => patch({ status: status as ContentStatus })}
          />

          <Field
            label="برچسب‌ها"
            htmlFor="news-tags"
            hint="هر برچسب را بنویسید و Enter بزنید."
          >
            <TagInput
              id="news-tags"
              value={values.tags ?? []}
              onChange={(tags) => patch({ tags })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="تاریخ انتشار (نمایشی)"
              htmlFor="news-date-label"
              hint="تقویم شمسی — روی کارت و صفحهٔ خبر"
            >
              <PersianDatePicker
                id="news-date-label"
                mode="date"
                value={values.dateLabel}
                onChange={(dateLabel) => patch({ dateLabel })}
                placeholder="۱۴۰۳/۰۵/۰۲"
              />
            </Field>
            <Field
              label="زمان انتشار (سیستمی)"
              htmlFor="news-published-at"
              hint="تقویم شمسی با ساعت — برای مرتب‌سازی و آرشیو"
            >
              <PersianDatePicker
                id="news-published-at"
                mode="datetime"
                value={values.publishedAt}
                onChange={(publishedAt) => patch({ publishedAt })}
                placeholder="۱۴۰۳/۰۵/۰۲ ۱۲:۳۰"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="بدنه"
          description="بلوک‌های محتوایی؛ خروجی همان ساختار blocks که در سایت رندر می‌شود."
        >
          <NewsBodyEditor
            blocks={values.blocks}
            onChange={(blocks) => patch({ blocks })}
          />
        </FormSection>

        <FormActions>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "edit" ? "ذخیره تغییرات" : "ایجاد خبر"}
          </button>
          <Link href="/news" className="btn-secondary">
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
          <Link
            href="/news/categories"
            className="ms-auto inline-flex items-center gap-1.5 text-xs font-medium text-pine hover:underline"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            دسته‌های خبر
          </Link>
        </FormActions>
      </form>

      <ConfirmDialog
        open={deleteOpen}
        title="حذف این خبر؟"
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
