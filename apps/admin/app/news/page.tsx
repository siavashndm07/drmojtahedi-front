"use client";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeleteNews, apiListNews, apiSaveNews } from "@/lib/api/resources";

export default function NewsAdminPage() {
  return (
    <ResourceCrud
      title="اخبار"
      description="مدیریت اخبار و اطلاعیه‌های بنیاد."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "category", label: "دسته" },
        { key: "status", label: "وضعیت", type: "select", options: [
          { value: "published", label: "منتشر" },
          { value: "draft", label: "پیش‌نویس" },
          { value: "coming-soon", label: "به‌زودی" },
        ], required: true },
        { key: "description", label: "خلاصه", type: "textarea" },
        { key: "body", label: "متن", type: "textarea" },
      ]}
      emptyForm={{ title: "", slug: "", category: "خبر", status: "published", description: "", body: "" }}
      list={apiListNews}
      save={(token, payload, id) => apiSaveNews(token, payload as never, id)}
      remove={apiDeleteNews}
    />
  );
}
