"use client";

import { FolderKanban } from "lucide-react";
import { ResourceCrud } from "@/components/ResourceCrud";
import {
  apiDeleteProject,
  apiListProjects,
  apiSaveProject,
} from "@/lib/api/resources";
import { PUBLISH_STATUS_OPTIONS } from "@/lib/optionSets";

export default function ProjectsAdminPage() {
  return (
    <ResourceCrud
      title="پروژه‌ها"
      description="پروژه‌های جاری بنیاد."
      emptyIcon={FolderKanban}
      emptyTitle="هنوز پروژه‌ای ثبت نشده"
      emptyDescription="پروژه‌های جاری بنیاد را با عنوان و فاز اضافه کنید."
      fields={[
        { key: "title", label: "عنوان", required: true },
        { key: "slug", label: "اسلاگ", required: true },
        { key: "phase", label: "فاز" },
        { key: "location", label: "مکان" },
        {
          key: "progress_percent",
          label: "درصد پیشرفت",
          type: "number",
          min: 0,
          max: 100,
          step: 5,
          allowEmpty: true,
          placeholder: "۰ تا ۱۰۰",
        },
        { key: "href", label: "لینک مرتبط" },
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
        phase: "",
        location: "",
        progress_percent: "",
        href: "",
        status: "published",
        description: "",
      }}
      list={apiListProjects}
      save={(token, payload, id) => apiSaveProject(token, payload, id)}
      remove={apiDeleteProject}
    />
  );
}
