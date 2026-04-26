"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { client } from "@/sanity/lib/client";
import { eventsQuery } from "@/sanity/lib/queries";
import EventCard, { EventSummary } from "./EventCard";

type Props = {
  title?: string;
  maxNonFeatured?: number;
  theme?: string;
};

export default function UpcomingEventsCard({
  title,
  maxNonFeatured = 2,
  theme = "primary",
}: Props) {
  const [events, setEvents] = useState<EventSummary[]>([]);

  useEffect(() => {
    client.fetch<EventSummary[]>(eventsQuery).then(setEvents);
  }, []);

  const featured = events.filter((e) => e.isFeatured);
  const nonFeatured = events.filter((e) => !e.isFeatured).slice(0, maxNonFeatured);
  const displayed = [...featured, ...nonFeatured];

  if (displayed.length === 0) return null;

  return (
    <section>
      {title && (
        <Container className="text-center mt-5">
          <h2 className={`text-gradient text-${theme}`}>{title}</h2>
        </Container>
      )}
      {displayed.map((event, index) => (
        <EventCard
          key={event._id}
          event={event}
          orientation={index % 2 === 0 ? "left" : "right"}
        />
      ))}
      <Container className="text-center mb-5">
        <Link href="/events">
          <button type="button" className={`btn bg-gradient-${theme}`}>
            View All Events
          </button>
        </Link>
      </Container>
    </section>
  );
}
