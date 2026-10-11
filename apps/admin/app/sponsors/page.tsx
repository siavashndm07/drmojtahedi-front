"use client";

import { ResourceCrud } from "@/components/ResourceCrud";
import {
  apiDeleteSponsor,
  apiListSponsors,
  apiSaveSponsor,
} from "@/lib/api/resources";
import { PUBLISH_STATUS_OPTIONS, SPONSOR_KIND_OPTIONS } from "@/lib/optionSets";

export default function SponsorsAdminPage() {
  return (
    <ResourceCrud
      title="حامیان"
      description="حامیان فردی و سازمانی."
      fields={[
        { key: "title", label: "نام", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        {
          key: "kind",
          label: "نوع",
          type: "pills",
          options: SPONSOR_KIND_OPTIONS,
          required: true,
          columns: 2,
        },
        { key: "logo_label", label: "برچسب لوگو" },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS.filter((o) => o.value !== "coming-soon"),
          required: true,
          columns: 2,
        },
        { key: "description", label: "توضیح", type: "textarea" },
      ]}
      emptyForm={{
        title: "",
        slug: "",
        kind: "individual",
        logo_label: "",
        status: "published",
        description: "",
      }}
      list={apiListSponsors}
      save={(token, payload, id) => apiSaveSponsor(token, payload as never, id)}
      remove={apiDeleteSponsor}
    />
  );
}
