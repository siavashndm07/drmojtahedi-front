"use client";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeleteArchive, apiListArchive, apiSaveArchive } from "@/lib/api/resources";

export default function ArchiveAdminPage() {
  return (
    <ResourceCrud
      title="آرشیو"
      description="اسناد، عکس، صوت و آثار."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "type", label: "نوع", type: "select", options: [
          { value: "document", label: "سند" },
          { value: "photo", label: "عکس" },
          { value: "audio", label: "صوت" },
          { value: "video", label: "ویدئو" },
          { value: "book", label: "کتاب" },
          { value: "object", label: "شیء" },
        ], required: true },
        { key: "collection", label: "مجموعه" },
        { key: "status", label: "وضعیت", type: "select", options: [
          { value: "published", label: "منتشر" },
          { value: "coming-soon", label: "به‌زودی" },
          { value: "draft", label: "پیش‌نویس" },
        ], required: true },
        { key: "description", label: "توضیح", type: "textarea" },
      ]}
      emptyForm={{ title: "", slug: "", type: "document", collection: "", status: "published", description: "" }}
      list={apiListArchive}
      save={(token, payload, id) => apiSaveArchive(token, payload as never, id)}
      remove={apiDeleteArchive}
    />
  );
}
