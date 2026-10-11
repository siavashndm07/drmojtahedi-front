"use client";
import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeleteSponsor, apiListSponsors, apiSaveSponsor } from "@/lib/api/resources";

export default function SponsorsAdminPage() {
  return (
    <ResourceCrud
      title="حامیان"
      description="حامیان فردی و سازمانی."
      fields={[
        { key: "title", label: "نام", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "kind", label: "نوع", type: "select", options: [
          { value: "individual", label: "فردی" },
          { value: "organization", label: "سازمانی" },
        ], required: true },
        { key: "logo_label", label: "برچسب لوگو" },
        { key: "status", label: "وضعیت", type: "select", options: [
          { value: "published", label: "منتشر" },
          { value: "draft", label: "پیش‌نویس" },
        ], required: true },
        { key: "description", label: "توضیح", type: "textarea" },
      ]}
      emptyForm={{ title: "", slug: "", kind: "individual", logo_label: "", status: "published", description: "" }}
      list={apiListSponsors}
      save={(token, payload, id) => apiSaveSponsor(token, payload as never, id)}
      remove={apiDeleteSponsor}
    />
  );
}
