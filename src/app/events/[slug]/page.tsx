import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/EventsViews";
import { getEvent, listEvents } from "@/lib/api/events";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await listEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return buildPageMetadata({ title: "رویداد یافت نشد", path: `/events/${slug}` });
  }
  return buildPageMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${event.slug}`,
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
