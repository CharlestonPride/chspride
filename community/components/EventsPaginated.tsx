"use client";

import { useState } from "react";
import EventCard, { type EventCardData } from "@/components/EventCard";

const PAGE_SIZE = 12;

export default function EventsPaginated({ events }: { events: EventCardData[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = events.slice(start, start + PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (events.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: "var(--color-muted)" }}>
        <p className="text-xl font-semibold mb-2">No upcoming events</p>
        <p className="text-base">Check back soon — more events are on the way!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {slice.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={!hasPrev}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            ← Previous
          </button>

          <span className="text-sm" style={{ color: "var(--color-muted)" }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={!hasNext}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
