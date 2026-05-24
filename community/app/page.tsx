import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { uipEventsQuery, uipResourcesQuery, uipFeaturedOrganizationsQuery } from "@/sanity/lib/queries";
import EventCard, { type EventCardData } from "@/components/EventCard";
import ResourceCard, { type ResourceCardData } from "@/components/ResourceCard";
import OrganizationCard, { type OrganizationData } from "@/components/OrganizationCard";
import { CHARLESTON_PRIDE } from "@/lib/constants";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="rainbow-bar w-8 mb-2" />
        <h2
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold"
        >
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-sm font-semibold hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          {linkLabel} &rarr;
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [events, resources, orgs] = await Promise.all([
    client.fetch<EventCardData[]>(uipEventsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch<ResourceCardData[]>(uipResourcesQuery, {}, { next: { revalidate: 3600 } }),
    client.fetch<OrganizationData[]>(uipFeaturedOrganizationsQuery, {}, { next: { revalidate: 3600 } }),
  ]);

  const upcomingEvents = events.slice(0, 4);
  const featuredResources = resources.filter((r) => r.isEmergency || r.isFeatured).slice(0, 4);
  const organizations: OrganizationData[] = [CHARLESTON_PRIDE, ...orgs];

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4 text-center"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Subtle rainbow glow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: "var(--gradient-rainbow)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center top, #a855f7 0%, transparent 70%)" }}
        />

        <div className="relative max-w-2xl mx-auto">
          <h1
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          >
            United{" "}
            <span
              style={{
                background: "var(--gradient-rainbow)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in Pride
            </span>
          </h1>
          <p className="text-lg max-w-lg mx-auto mb-8" style={{ color: "var(--color-muted)" }}>
            A community hub for Charleston&apos;s LGBTQIA+ community — events, resources, and local
            organizations, all in one place.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/events"
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
            >
              Browse Events
            </Link>
            <Link
              href="/resources"
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:border-purple-400"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              Find Resources
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-16">

        {/* Upcoming Events */}
        <section>
          <SectionHeader title="Upcoming Events" href="/events" linkLabel="All Events" />
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              No upcoming events right now. Check back soon!
            </p>
          )}
        </section>

        {/* Resources */}
        <section>
          <SectionHeader title="Community Resources" href="/resources" linkLabel="All Resources" />
          {featuredResources.length > 0 ? (
            <div className="flex flex-col gap-3">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Resource directory coming soon.
            </p>
          )}
        </section>

        {/* Organizations */}
        <section id="organizations">
          <SectionHeader title="LGBTQIA+ Organizations" href="/organizations" linkLabel="All Organizations" />
          <div className="flex flex-col gap-4">
            {organizations.map((org) => (
              <OrganizationCard key={org._id} org={org} />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
