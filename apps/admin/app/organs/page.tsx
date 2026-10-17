"use client";

import { Landmark } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeleteOrgan, apiListOrgans, apiSaveOrgan } from "@/lib/api/resources";
import { ORGAN_GROUP_OPTIONS, PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function OrgansAdminPage() {
  return (
    <ResourceCrud
      title="ارکان"
      description="هیئت‌ها، اعضا و نمایندگان."
      emptyIcon={Landmark}
      emptyTitle="هنوز رکنی ثبت نشده"
      emptyDescription="هیئت‌ها، اعضا و نمایندگان را با نام و نقش اضافه کنید."
      fields={[
        { key: "name", label: "نام", required: true },
        { key: "role", label: "نقش", required: true },
        {
          key: "group",
          label: "گروه",
          type: "pills",
          options: ORGAN_GROUP_OPTIONS,
          required: true,
          columns: 2,
        },
        { key: "location", label: "محل" },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS.filter((o) => o.value !== "coming-soon"),
          required: true,
          columns: 2,
        },
        { key: "note", label: "یادداشت", type: "textarea" },
      ]}
      emptyForm={{
        name: "",
        role: "",
        group: "boards",
        location: "",
        status: "published",
        note: "",
      }}
      list={apiListOrgans}
      save={(token, payload, id) => apiSaveOrgan(token, payload, id)}
      remove={apiDeleteOrgan}
    />
  );
}
