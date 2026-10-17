"use client";

import { use } from "react";
import ArticlesFormClient from "@/components/ArticlesFormClient";

export default function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ArticlesFormClient mode="edit" id={id} />;
}
