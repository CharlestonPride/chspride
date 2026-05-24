import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export interface EventCardData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { asset?: { _ref?: string } };
  location?: { venue?: string; city?: string; state?: string };
  startDateTime: string;
  endDateTime?: string;
  isFree?: boolean;
  price?: string;
  ageRestriction?: string;
  ctaLabel?: string;
  isFeatured?: boolean;
  hasTickets?: boolean;
  showOnCP?: boolean;
  uipMoreInfoUrl?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCard({ event }: { event: EventCardData }) {
  const imgRef = event.image?.asset?._ref;
  const imgUrl = imgRef ? urlFor(event.image!).width(600).height(400).fit("crop").url() : null;
  const priceLabel = event.isFree !== false ? "Free" : (event.price ?? "");
  const ageLabel = event.ageRestriction && event.ageRestriction !== "all-ages" ? event.ageRestriction : null;
  const venueLabel = event.location?.venue ?? `${event.location?.city ?? "Charleston"}, ${event.location?.state ?? "SC"}`;

  const cpUrl = `https://charlestonpride.org/events/${event.slug}`;
  const externalHref = event.showOnCP ? cpUrl : (event.uipMoreInfoUrl ?? null);

  const sharedClassName = "group block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5";
  const sharedStyle = {
    backgroundColor: "var(--color-card)",
    border: "1px solid var(--color-border)",
    textDecoration: "none",
  };

  const content = (
    <>
      {/* Image or placeholder */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--gradient-rainbow)", opacity: 0.15 }}
          />
        )}

        {event.isFeatured && (
          <div
            className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="font-bold text-base leading-snug group-hover:text-purple-300 transition-colors"
        >
          {event.name}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-muted)" }}
          >
            {formatDate(event.startDateTime)} &middot; {formatTime(event.startDateTime)}
          </span>

          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: event.isFree !== false ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
              color: event.isFree !== false ? "var(--color-success)" : "var(--color-warning)",
            }}
          >
            {priceLabel}
          </span>

          {ageLabel && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "var(--color-danger)" }}
            >
              {ageLabel}
            </span>
          )}
        </div>

        <p style={{ color: "var(--color-muted)" }} className="text-xs">
          {venueLabel}
        </p>

        {event.description && (
          <p style={{ color: "var(--color-muted)" }} className="text-sm line-clamp-2">
            {event.description}
          </p>
        )}

        <span
          className="mt-auto self-start text-sm font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {event.ctaLabel ?? "More Info"} &rarr;
        </span>
      </div>
    </>
  );

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
        style={sharedStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className={sharedClassName} style={sharedStyle}>
      {content}
    </Link>
  );
}
