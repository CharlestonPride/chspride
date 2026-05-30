import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { uipEventBySlugQuery, uipEventSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import PortableText from "@/components/PortableText";
import AddToCalendarButtons from "@/components/AddToCalendarButtons";

interface EventDetail {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  content?: any[];
  images?: { asset?: { _ref?: string } }[];
  location?: { venue?: string; address?: string; city?: string; state?: string; zip?: string };
  startDateTime: string;
  endDateTime?: string;
  isFree?: boolean;
  price?: string;
  ageRestriction?: string;
  keywords?: string[];
  isFeatured?: boolean;
  showOnCP?: boolean;
  tickets?: {
    url?: string;
    embedMode?: string;
    isSoldOut?: boolean;
    soldOutMessage?: string;
    unavailableMessage?: string;
    openDateTime?: string;
    closeDateTime?: string;
  };
  registration?: {
    label?: string;
    description?: string;
    url?: string;
    embedMode?: string;
    openDateTime?: string;
    closeDateTime?: string;
    unavailableMessage?: string;
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(uipEventSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(uipEventBySlugQuery, { slug });
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.name,
    description: event.description,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLocation(location?: EventDetail["location"]) {
  if (!location) return null;
  return [
    location.venue,
    location.address,
    [location.city ?? "Charleston", location.state ?? "SC"].join(", "),
    location.zip,
  ]
    .filter(Boolean)
    .join(" · ");
}

function Chip({
  children,
  color = "purple",
}: {
  children: React.ReactNode;
  color?: "purple" | "green" | "yellow" | "red" | "gray";
}) {
  const styles: Record<string, { bg: string; text: string }> = {
    purple: { bg: "rgba(168,85,247,0.15)", text: "var(--color-primary)" },
    green: { bg: "rgba(34,197,94,0.15)", text: "var(--color-success)" },
    yellow: { bg: "rgba(245,158,11,0.15)", text: "var(--color-warning)" },
    red: { bg: "rgba(239,68,68,0.15)", text: "var(--color-danger)" },
    gray: { bg: "var(--color-surface)", text: "var(--color-muted)" },
  };
  const { bg, text } = styles[color];
  return (
    <span
      className="text-base px-3 py-1 rounded-full font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(uipEventBySlugQuery, { slug });

  if (!event) notFound();

  const heroRef = event.images?.[0]?.asset?._ref;
  const locationLabel = formatLocation(event.location);
  const priceLabel = event.isFree !== false ? "Free" : (event.price ?? "");
  const ageLabel = event.ageRestriction && event.ageRestriction !== "all-ages" ? event.ageRestriction : null;

  const now = new Date();

  const ticketWindowOpen =
    !event.tickets?.openDateTime || new Date(event.tickets.openDateTime) <= now;
  const ticketWindowClosed =
    event.tickets?.closeDateTime ? new Date(event.tickets.closeDateTime) < now : false;
  const showTickets =
    event.tickets?.url && !event.tickets.isSoldOut && ticketWindowOpen && !ticketWindowClosed;
  const showTicketUnavailable =
    event.tickets?.url && !event.tickets.isSoldOut && (!ticketWindowOpen || ticketWindowClosed);

  const registrationWindowOpen =
    !event.registration?.openDateTime || new Date(event.registration.openDateTime) <= now;
  const registrationWindowClosed =
    event.registration?.closeDateTime ? new Date(event.registration.closeDateTime) < now : false;
  const showRegistration =
    event.registration?.url && registrationWindowOpen && !registrationWindowClosed;
  const showRegistrationUnavailable =
    event.registration?.url && (!registrationWindowOpen || registrationWindowClosed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-base mb-6 hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        &larr; Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Hero image */}
        {heroRef && (
          <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(event.images![0]).width(800).height(600).fit("crop").url()}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className={heroRef ? "" : "lg:col-span-2"}>
          {event.isFeatured && (
            <div className="rainbow-bar w-10 mb-3" />
          )}

          <h1
            style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
            className="text-3xl font-bold mb-4"
          >
            {event.name}
          </h1>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Chip color="gray">
              {formatDate(event.startDateTime)}
              {event.endDateTime &&
                new Date(event.startDateTime).toDateString() !== new Date(event.endDateTime).toDateString() &&
                ` – ${formatDate(event.endDateTime)}`}
            </Chip>
            <Chip color="gray">
              {formatTime(event.startDateTime)}
              {event.endDateTime && ` – ${formatTime(event.endDateTime)}`}
            </Chip>
            <Chip color={event.isFree !== false ? "green" : "yellow"}>{priceLabel}</Chip>
            {ageLabel && <Chip color="red">{ageLabel}</Chip>}
          </div>

          {locationLabel && (
            <p className="text-base mb-4 flex items-center gap-1" style={{ color: "var(--color-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {locationLabel}
            </p>
          )}

          {event.description && (
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-muted)" }}>
              {event.description}
            </p>
          )}

          {/* CTAs */}
          {event.showOnCP ? (
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href={`https://charlestonpride.org/events/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-base font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
              >
                View on Charleston Pride &rarr;
              </a>
            </div>
          ) : (
            <>
              {(showTickets || showRegistration) && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {showTickets && (
                    <a
                      href={event.tickets!.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg text-base font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
                    >
                      Get Tickets
                    </a>
                  )}
                  {showRegistration && (
                    <a
                      href={event.registration!.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg text-base font-semibold transition-colors hover:border-purple-400"
                      style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      {event.registration!.label ?? "Register"}
                    </a>
                  )}
                </div>
              )}

              {event.tickets?.url && event.tickets.isSoldOut && (
                <p className="text-base mt-3 font-medium" style={{ color: "var(--color-danger)" }}>
                  {event.tickets.soldOutMessage ?? "Tickets are sold out."}
                </p>
              )}

              {showTicketUnavailable && (
                <p className="text-base mt-3" style={{ color: "var(--color-muted)" }}>
                  {event.tickets!.unavailableMessage ?? "Tickets are not currently available."}
                </p>
              )}

              {showRegistrationUnavailable && (
                <p className="text-base mt-3" style={{ color: "var(--color-muted)" }}>
                  {event.registration!.unavailableMessage ?? "Registration is not currently available."}
                </p>
              )}
            </>
          )}

          <AddToCalendarButtons
            name={event.name}
            startDateTime={event.startDateTime}
            endDateTime={event.endDateTime}
            description={event.description}
            location={locationLabel ?? undefined}
          />
        </div>
      </div>

      {/* Full content */}
      {(event.content?.length ?? 0) > 0 && (
        <div
          className="mt-10 pt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <PortableText value={event.content!} />
        </div>
      )}

      {/* Additional images */}
      {(event.images?.length ?? 0) > 1 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {event.images!.slice(1).map((img: any, i: number) => {
            const ref = img?.asset?._ref;
            if (!ref) return null;
            return (
              <div key={i} className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(img).width(800).url()}
                  alt={`${event.name} photo ${i + 2}`}
                  className="w-full object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
