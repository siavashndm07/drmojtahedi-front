import type { EventItem, EventSchedule } from "@/lib/types";

export type EventFilter = "all" | EventSchedule;

export function resolveEventSchedule(event: EventItem): EventSchedule {
  if (event.schedule === "upcoming" || event.schedule === "past") {
    return event.schedule;
  }
  if (event.startAt) {
    const time = Date.parse(event.startAt);
    if (!Number.isNaN(time)) {
      return time >= Date.now() ? "upcoming" : "past";
    }
  }
  if (event.status === "coming-soon") return "upcoming";
  return "past";
}

export function filterEvents(events: EventItem[], filter: EventFilter): EventItem[] {
  if (filter === "all") return events;
  return events.filter((event) => resolveEventSchedule(event) === filter);
}

export function countEventsBySchedule(events: EventItem[]) {
  return events.reduce(
    (acc, event) => {
      acc[resolveEventSchedule(event)] += 1;
      return acc;
    },
    { upcoming: 0, past: 0 },
  );
}
