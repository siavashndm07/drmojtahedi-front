"use client";

import { Archive } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import {
  apiDeleteArchive,
  apiListArchive,
  apiSaveArchive,
} from "@/lib/api/resources";
import { ARCHIVE_TYPE_OPTIONS, PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function ArchiveAdminPage() {
  return (
    <ResourceCrud
      title="آرشیو"
      description="اسناد، عکس، صوت و آثار."
      emptyIcon={Archive}
      emptyTitle="هنوز آیتمی در آرشیو نیست"
      emptyDescription="اسناد، عکس، صوت و آثار را از اینجا ثبت کنید."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        {
          key: "type",
          label: "نوع",
          type: "pills",
          options: ARCHIVE_TYPE_OPTIONS,
          required: true,
          columns: 3,
        },
        { key: "collection", label: "مجموعه" },
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
        title: "",
        slug: "",
        type: "document",
        collection: "",
        status: "published",
        description: "",
      }}
      list={apiListArchive}
      save={(token, payload, id) => apiSaveArchive(token, payload as never, id)}
      remove={apiDeleteArchive}
    />
  );
}
