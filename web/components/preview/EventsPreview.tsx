"use client";
import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import HeaderBuilder from "@/components/header/headerBuilder";
import EventCard, { EventSummary } from "@/components/card/eventCard";
import { eventsPageQuery, eventsQuery } from "@/sanity/lib/queries";

export default function EventsPreview() {
  const [page, setPage] = useState<any>(null);
  const [events, setEvents] = useState<EventSummary[] | null>(null);

  useEffect(() => {
    Promise.all([
      previewClient.fetch(eventsPageQuery),
      previewClient.fetch<EventSummary[]>(eventsQuery),
    ]).then(([p, e]) => {
      setPage(p);
      setEvents(e ?? []);
    });
  }, []);

  if (!events) return <div className="text-center py-10">Loading preview…</div>;

  const content =
    events.length > 0 ? (
      events.map((event, index) => (
        <EventCard
          key={event._id}
          event={event}
          orientation={index % 2 === 0 ? "left" : "right"}
        />
      ))
    ) : (
      <p className="text-center py-10">No upcoming events. Check back soon!</p>
    );

  return (
    <main>
      <HeaderBuilder header={page?.header} content={content} id="events" />
    </main>
  );
}
