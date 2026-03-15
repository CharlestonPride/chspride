import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import { urlFor } from "@/sanity/lib/image";

export type EventSummary = {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  image?: { asset?: { _ref?: string } };
  location?: {
    venue?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  startDateTime: string;
  endDateTime?: string;
  isFree?: boolean;
  price?: string;
  ageRestriction?: string;
  ctaLabel?: string;
};

export type EventCardProps = {
  event: EventSummary;
  orientation: "left" | "right";
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateRange(start: string, end?: string): string {
  const startDate = formatDate(start);
  const startTime = formatTime(start);
  if (!end) return `${startDate} at ${startTime}`;

  const endTime = formatTime(end);
  const sameDay =
    new Date(start).toDateString() === new Date(end).toDateString();

  return sameDay
    ? `${startDate} · ${startTime} – ${endTime}`
    : `${startDate} at ${startTime} – ${formatDate(end)} at ${endTime}`;
}

function formatLocation(
  location?: EventSummary["location"],
): string | undefined {
  if (!location) return undefined;
  const parts = [location.venue, location.city ?? "Charleston"].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

const EventContent = ({ event }: { event: EventSummary }) => {
  const priceLabel = event.isFree !== false ? "Free" : (event.price ?? "");
  const locationLabel = formatLocation(event.location);
  const ageLabel =
    event.ageRestriction && event.ageRestriction !== "all-ages"
      ? event.ageRestriction
      : undefined;

  return (
    <>
      <p className="text-primary mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {formatDateRange(event.startDateTime, event.endDateTime)}
      </p>
      <h3 className="text-gradient mb-0 text-primary">{event.name}</h3>

      <div className="mt-2 d-flex flex-wrap gap-2">
        {locationLabel && (
          <span className="badge bg-gradient-secondary text-white">
            📍 {locationLabel}
          </span>
        )}
        <span className="badge bg-gradient-success text-white">
          {priceLabel}
        </span>
        {ageLabel && (
          <span className="badge bg-gradient-warning text-white">{ageLabel}</span>
        )}
      </div>

      {event.description && (
        <p className="mt-3 lead" style={{ fontSize: "1rem" }}>
          {event.description}
        </p>
      )}

      <Link href={`/events/${event.slug.current}`} className="mt-3 d-inline-block">
        <button type="button" className="btn bg-gradient-primary">
          {event.ctaLabel ?? "More Info"}
        </button>
      </Link>
    </>
  );
};

export default function EventCard({ event, orientation }: EventCardProps) {
  const imageRef = event.image?.asset?._ref;
  const imageUrl = imageRef ? urlFor(imageRef).url() : undefined;

  const contentCol = (
    <Col
      xs="10"
      lg="5"
      className="mx-auto py-5 text-lg-left text-center"
    >
      <EventContent event={event} />
    </Col>
  );

  const imageCol = (
    <Col xs="10" lg="6" className="mx-lg-0 mx-auto px-lg-0 px-md-0 my-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={event.name}
          className="w-100 border-radius-lg shadow-card"
        />
      )}
    </Col>
  );

  return (
    <Container className="my-5">
      <Row>
        {orientation === "left" ? (
          <>
            {contentCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {contentCol}
          </>
        )}
      </Row>
    </Container>
  );
}
