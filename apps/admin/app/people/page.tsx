"use client";

import { Users } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeletePerson, apiListPeople, apiSavePerson } from "@/lib/api/resources";
import { PERSON_KIND_OPTIONS, PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function PeopleAdminPage() {
  return (
    <ResourceCrud
      title="افراد"
      description="شاگردان، مؤسسان و چهره‌های مرتبط."
      emptyIcon={Users}
      emptyTitle="هنوز فردی ثبت نشده"
      emptyDescription="شاگردان، مؤسسان و چهره‌های مرتبط را از اینجا اضافه کنید."
      fields={[
        { key: "name", label: "نام", required: true },
        { key: "title", label: "عنوان نمایشی", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "role", label: "نقش" },
        {
          key: "kind",
          label: "گونه",
          type: "pills",
          options: PERSON_KIND_OPTIONS,
          columns: 3,
        },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS,
          required: true,
          columns: 3,
        },
        { key: "description", label: "توضیح", type: "textarea" },
        { key: "biography", label: "زندگی‌نامه", type: "textarea" },
      ]}
      emptyForm={{
        name: "",
        title: "",
        slug: "",
        role: "",
        kind: "other",
        status: "published",
        description: "",
        biography: "",
      }}
      list={apiListPeople}
      save={(token, payload, id) => apiSavePerson(token, payload as never, id)}
      remove={apiDeletePerson}
    />
  );
}
