"use client";

import { Mic } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import {
  apiDeleteOralHistory,
  apiListOralHistory,
  apiSaveOralHistory,
} from "@/lib/api/resources";
import { PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function OralHistoryAdminPage() {
  return (
    <ResourceCrud
      title="تاریخ شفاهی"
      description="مصاحبه‌ها و روایت‌های شنیداری."
      emptyIcon={Mic}
      emptyTitle="هنوز مصاحبه‌ای ثبت نشده"
      emptyDescription="روایت‌های شنیداری را با عنوان و نام راوی اضافه کنید."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "subtitle", label: "زیرعنوان" },
        { key: "narrator", label: "راوی" },
        { key: "year", label: "سال" },
        { key: "duration_label", label: "مدت" },
        { key: "collection", label: "مجموعه" },
        { key: "audio_src", label: "لینک صوت" },
        { key: "related_href", label: "لینک مرتبط" },
        { key: "related_label", label: "برچسب لینک" },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS,
          required: true,
          columns: 3,
        },
        { key: "description", label: "توضیح", type: "textarea" },
        { key: "transcript_excerpt", label: "گزیدهٔ پیاده‌سازی", type: "textarea" },
      ]}
      emptyForm={{
        title: "",
        slug: "",
        subtitle: "",
        narrator: "",
        year: "",
        duration_label: "",
        collection: "",
        audio_src: "",
        related_href: "",
        related_label: "",
        status: "published",
        description: "",
        transcript_excerpt: "",
      }}
      list={apiListOralHistory}
      save={(token, payload, id) => apiSaveOralHistory(token, payload, id)}
      remove={apiDeleteOralHistory}
    />
  );
}
