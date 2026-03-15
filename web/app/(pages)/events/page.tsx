import { client } from "@/sanity/lib/client";
import { eventsPageQuery, eventsQuery } from "@/sanity/lib/queries";
import HeaderBuilder from "@/components/header/headerBuilder";
import EventCard, { EventSummary } from "@/components/card/eventCard";
import EventsPreview from "@/components/preview/EventsPreview";

export default async function EventsPage() {
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <EventsPreview />;
  }

  const [page, events] = await Promise.all([
    client.fetch(eventsPageQuery),
    client.fetch<EventSummary[]>(eventsQuery),
  ]);

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
      <HeaderBuilder
        header={page?.header}
        content={content}
        id="events"
      />
    </main>
  );
}
