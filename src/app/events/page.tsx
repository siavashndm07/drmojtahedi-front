import type { Metadata } from "next";
import { EventsIndex } from "@/components/events/EventsViews";
import { listEvents } from "@/lib/api/events";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "رویدادها",
  description: "تقویم رویدادهای فرهنگی بنیاد — نکوداشت، گفت‌وگو و برنامه‌های میراثی.",
  path: "/events",
});

export default async function EventsPage() {
  const events = await listEvents();
  return <EventsIndex events={events} />;
}
