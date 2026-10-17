"use client";

import { use } from "react";
import BooksFormClient from "@/components/BooksFormClient";

export default function BookEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BooksFormClient mode="edit" id={id} />;
}
