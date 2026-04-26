import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import LinkMark from "@/components/portableText/link";
import WaveHeader from "@/components/header/waveHeader";
import TicketSection, { TicketData } from "@/components/event/TicketSection";
import RegistrationButton, {
  RegistrationData,
} from "@/components/event/RegistrationButton";

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
  theme?: string;
  keywords?: string[];
  tickets?: TicketData;
  registration?: RegistrationData & { description?: string };
}

export default function EventDetailView({ event }: { event: EventDetail }) {
  const priceLabel = event.isFree !== false ? "Free" : (event.price ?? "");
  const locationLabel = formatLocation(event.location);
  const ageLabel =
    event.ageRestriction && event.ageRestriction !== "all-ages"
      ? event.ageRestriction
      : undefined;

  const theme = event.theme ?? "primary";
  const heroRef = event.images?.[0]?.asset?._ref;
  const hasImage = !!heroRef;

  return (
    <main>
      <WaveHeader header={{ title: event.name, theme: event.theme ?? "primary" } as any}>
        <Row className="g-4">
          {hasImage && (
            <Col xs={12} lg={5}>
              <img
                src={urlFor(heroRef!).width(600).url()}
                alt={event.name}
                className="w-100 border-radius-lg shadow-card"
              />
            </Col>
          )}

          <Col xs={12} lg={hasImage ? 7 : 12}>
            <Link href="/events" className="text-primary mb-3 d-inline-block">
              ← Back to Events
            </Link>

            <div className="d-flex flex-wrap gap-2 my-3">
              <span
                className={`badge bg-gradient-${theme} text-white`}
                style={{ fontSize: "0.9rem" }}
              >
                📅 {formatDate(event.startDateTime)}
                {event.endDateTime &&
                  new Date(event.startDateTime).toDateString() !==
                  new Date(event.endDateTime).toDateString() &&
                  ` – ${formatDate(event.endDateTime)}`}
              </span>
              <span
                className={`badge bg-gradient-${theme} text-white`}
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

          </Col>
        </Row>

        {(event.registration?.url || event.tickets?.url) && (
          <Row className="mt-4">
            <Col xs={12}>
              {event.registration?.url && (
                <RegistrationButton
                  registration={event.registration}
                  eventSlug={event.slug?.current ?? ""}
                />
              )}
              {event.tickets?.url && (
                <TicketSection tickets={event.tickets} />
              )}
            </Col>
          </Row>
        )}

        {(event.images?.length ?? 0) > 1 && (
          <Row className="mt-5 g-3">
            {event.images!.slice(1).map((img: any, i: number) => {
              const ref = img?.asset?._ref;
              if (!ref) return null;
              return (
                <Col key={i} xs="12" md="6">
                  <img
                    src={urlFor(ref).width(600).url()}
                    alt={`${event.name} photo ${i + 2}`}
                    className="w-100 border-radius-lg shadow-card"
                  />
                </Col>
              );
            })}
          </Row>
        )}
      </WaveHeader>
    </main>
  );
}
