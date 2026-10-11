"use client";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeletePerson, apiListPeople, apiSavePerson } from "@/lib/api/resources";

export default function PeopleAdminPage() {
  return (
    <ResourceCrud
      title="افراد"
      description="شاگردان، مؤسسان و چهره‌های مرتبط."
      fields={[
        { key: "name", label: "نام", required: true },
        { key: "title", label: "عنوان نمایشی", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "role", label: "نقش" },
        { key: "kind", label: "گونه", type: "select", options: [
          { value: "student", label: "شاگرد" },
          { value: "colleague", label: "همکار" },
          { value: "founder", label: "مؤسس" },
          { value: "family", label: "خانواده" },
          { value: "organ", label: "ارکان" },
          { value: "other", label: "سایر" },
        ] },
        { key: "status", label: "وضعیت", type: "select", options: [
          { value: "published", label: "منتشر" },
          { value: "draft", label: "پیش‌نویس" },
          { value: "coming-soon", label: "به‌زودی" },
        ], required: true },
        { key: "description", label: "توضیح", type: "textarea" },
        { key: "biography", label: "زندگی‌نامه", type: "textarea" },
      ]}
      emptyForm={{ name: "", title: "", slug: "", role: "", kind: "other", status: "published", description: "", biography: "" }}
      list={apiListPeople}
      save={(token, payload, id) => apiSavePerson(token, payload as never, id)}
      remove={apiDeletePerson}
    />
  );
}
