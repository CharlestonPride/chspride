import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { uipEventsQuery } from "@/sanity/lib/queries";
import EventCard, { type EventCardData } from "@/components/EventCard";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming LGBTQIA+ events in Charleston and the Lowcountry.",
};

export default async function EventsPage() {
  const events = await client.fetch<EventCardData[]>(
    uipEventsQuery,
    {},
    { next: { revalidate: 60 } }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          Upcoming Events
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          LGBTQIA+ events in Charleston and the Lowcountry.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24" style={{ color: "var(--color-muted)" }}>
          <p className="text-xl font-semibold mb-2">No upcoming events</p>
          <p className="text-sm">Check back soon — more events are on the way!</p>
        </div>
      )}

      {/* Google Calendar — embed on desktop, button on mobile */}
      <div className="mt-10">
        <a
          href="https://calendar.google.com/calendar/embed?src=c_1b66c6e757e2b6f7fff05a847d8406ae3a39bc0204307afef7d5814991f6b3ec%40group.calendar.google.com&ctz=America%2FNew_York"
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          Open Community Calendar &rarr;
        </a>

        <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=c_1b66c6e757e2b6f7fff05a847d8406ae3a39bc0204307afef7d5814991f6b3ec%40group.calendar.google.com&ctz=America%2FNew_York"
            style={{ border: 0, display: "block", filter: "invert(1) hue-rotate(180deg)" }}
            width="100%"
            height="600"
            title="Charleston Pride Community Calendar"
          />
        </div>
      </div>
    </div>
  );
}
