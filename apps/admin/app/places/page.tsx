"use client";

import { ResourceCrud } from "@/components/ResourceCrud";
import { apiDeletePlace, apiListPlaces, apiSavePlace } from "@/lib/api/resources";
import { PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function PlacesAdminPage() {
  return (
    <ResourceCrud
      title="مکان‌ها"
      description="مکان‌های میراث روی نقشه و صفحات جزئیات."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "location", label: "موقعیت" },
        { key: "lat", label: "عرض جغرافیایی" },
        { key: "lng", label: "طول جغرافیایی" },
        {
          key: "status",
          label: "وضعیت انتشار",
          type: "pills",
          options: PUBLISH_STATUS_OPTIONS,
          required: true,
          columns: 3,
        },
        { key: "description", label: "توضیح", type: "textarea" },
        {
          key: "historical_significance",
          label: "اهمیت تاریخی",
          type: "textarea",
        },
      ]}
      emptyForm={{
        title: "",
        slug: "",
        location: "",
        lat: "",
        lng: "",
        status: "published",
        description: "",
        historical_significance: "",
      }}
      list={apiListPlaces}
      save={(token, payload, id) => apiSavePlace(token, payload, id)}
      remove={apiDeletePlace}
    />
  );
}
