"use client";

import { use } from "react";
import NewsFormClient from "@/components/NewsFormClient";

export default function NewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <NewsFormClient mode="edit" id={id} />;
}
