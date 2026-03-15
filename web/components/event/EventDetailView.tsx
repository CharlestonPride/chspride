import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import LinkMark from "@/components/portableText/link";

const portableTextComponents: Partial<PortableTextReactComponents> = {
  marks: { link: LinkMark },
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

function formatLocation(location?: {
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}): string | undefined {
  if (!location) return undefined;
  const parts = [
    location.venue,
    location.address,
    [location.city ?? "Charleston", location.state ?? "SC"]
      .filter(Boolean)
      .join(", "),
    location.zip,
  ].filter(Boolean);
  return parts.join(" · ");
}

export interface EventDetail {
  _id: string;
  name: string;
  slug?: { current?: string };
  description?: string;
  content?: any[];
  images?: { asset?: { _ref?: string } }[];
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
  keywords?: string[];
}

export default function EventDetailView({ event }: { event: EventDetail }) {
  const primaryImageRef = event.images?.[0]?.asset?._ref;
  const primaryImageUrl = primaryImageRef
    ? urlFor(primaryImageRef).url()
    : undefined;
  const priceLabel = event.isFree !== false ? "Free" : (event.price ?? "");
  const locationLabel = formatLocation(event.location);
  const ageLabel =
    event.ageRestriction && event.ageRestriction !== "all-ages"
      ? event.ageRestriction
      : undefined;

  return (
    <main>
      {primaryImageUrl && (
        <div
          style={{
            height: "40vh",
            background: `url(${primaryImageUrl}) center/cover no-repeat`,
          }}
        />
      )}

      <Container className="py-6">
        <Row>
          <Col lg={{ span: 8, offset: 2 }}>
            <Link href="/events" className="text-primary mb-4 d-inline-block">
              ← Back to Events
            </Link>

            <h1 className="text-gradient text-primary">{event.name}</h1>

            <div className="d-flex flex-wrap gap-2 my-3">
              <span
                className="badge bg-gradient-primary text-white"
                style={{ fontSize: "0.9rem" }}
              >
                📅 {formatDate(event.startDateTime)}
                {event.endDateTime &&
                  new Date(event.startDateTime).toDateString() !==
                    new Date(event.endDateTime).toDateString() &&
                  ` – ${formatDate(event.endDateTime)}`}
              </span>
              <span
                className="badge bg-gradient-primary text-white"
                style={{ fontSize: "0.9rem" }}
              >
                🕐 {formatTime(event.startDateTime)}
                {event.endDateTime && ` – ${formatTime(event.endDateTime)}`}
              </span>
              {locationLabel && (
                <span
                  className="badge bg-gradient-secondary text-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  📍 {locationLabel}
                </span>
              )}
              <span
                className="badge bg-gradient-success text-white"
                style={{ fontSize: "0.9rem" }}
              >
                {priceLabel}
              </span>
              {ageLabel && (
                <span
                  className="badge bg-gradient-warning text-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  {ageLabel}
                </span>
              )}
            </div>

            {event.description && (
              <p className="lead mt-3">{event.description}</p>
            )}

            {(event.content?.length ?? 0) > 0 && (
              <div className="mt-4">
                <PortableText
                  value={event.content}
                  components={portableTextComponents}
                />
              </div>
            )}

            {(event.images?.length ?? 0) > 1 && (
              <Row className="mt-5 g-3">
                {event.images!.slice(1).map((img: any, i: number) => {
                  const ref = img?.asset?._ref;
                  if (!ref) return null;
                  return (
                    <Col key={i} xs="12" md="6">
                      <img
                        src={urlFor(ref).url()}
                        alt={`${event.name} photo ${i + 2}`}
                        className="w-100 border-radius-lg shadow-card"
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
