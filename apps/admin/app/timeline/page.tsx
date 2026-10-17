"use client";

import { History } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import {
  apiDeleteTimeline,
  apiListTimeline,
  apiSaveTimeline,
} from "@/lib/api/resources";
import { PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function TimelineAdminPage() {
  return (
    <ResourceCrud
      title="خط زمان"
      description="رویدادهای گاه‌شمار زندگی و میراث."
      emptyIcon={History}
      emptyTitle="هنوز رویدادی در خط زمان نیست"
      emptyDescription="سال و عنوان اولین رویداد را ثبت کنید."
      fields={[
        { key: "year", label: "سال", required: true },
        { key: "title", label: "عنوان", required: true },
        { key: "category", label: "دسته" },
        { key: "location", label: "مکان" },
        { key: "source", label: "منبع" },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS,
          required: true,
          columns: 3,
        },
        { key: "description", label: "توضیح", type: "textarea" },
      ]}
      emptyForm={{
        year: "",
        title: "",
        category: "",
        location: "",
        source: "",
        status: "published",
        description: "",
      }}
      list={apiListTimeline}
      save={(token, payload, id) => apiSaveTimeline(token, payload, id)}
      remove={apiDeleteTimeline}
    />
  );
}
