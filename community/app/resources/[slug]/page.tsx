import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { uipResourceBySlugQuery, uipResourceSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import PortableText from "@/components/PortableText";

interface ResourceDetail {
  _id: string;
  name: string;
  slug: string;
  logo?: { asset?: { _ref?: string } };
  category?: string;
  description?: string;
  content?: any[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    isVirtual?: boolean;
    serviceArea?: string;
  };
  hours?: string;
  isEmergency?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  tags?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  healthcare: "Healthcare",
  mentalHealth: "Mental Health",
  legal: "Legal Services",
  supportGroup: "Support Groups",
  youth: "Youth Services",
  senior: "Senior Services",
  housing: "Housing",
  emergency: "Emergency",
  business: "Businesses",
  organization: "Organizations",
  education: "Education",
  spiritual: "Spiritual & Faith",
  social: "Social & Recreation",
};

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(uipResourceSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await client.fetch<ResourceDetail | null>(uipResourceBySlugQuery, { slug });
  if (!resource) return { title: "Resource Not Found" };
  return {
    title: resource.name,
    description: resource.description,
  };
}

function ContactItem({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="flex items-center gap-2 text-sm hover:underline"
      style={{ color: "var(--color-primary)" }}
    >
      {children}
    </a>
  );
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await client.fetch<ResourceDetail | null>(uipResourceBySlugQuery, { slug });

  if (!resource) notFound();

  const logoRef = resource.logo?.asset?._ref;
  const logoUrl = logoRef ? urlFor(resource.logo!).width(160).height(160).fit("crop").url() : null;
  const categoryLabel = resource.category ? (CATEGORY_LABELS[resource.category] ?? resource.category) : null;

  const locationLabel = resource.location?.isVirtual
    ? (resource.location.serviceArea ?? "Online")
    : [
        resource.location?.address,
        resource.location?.city && resource.location?.state
          ? `${resource.location.city}, ${resource.location.state}`
          : resource.location?.city,
        resource.location?.zip,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        &larr; Back to Resources
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        {logoUrl && (
          <div
            className="shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={resource.name} className="w-full h-full object-contain p-2" />
          </div>
        )}

        <div>
          {resource.isEmergency && (
            <div className="rainbow-bar w-8 mb-2" />
          )}
          <h1
            style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
            className="text-2xl font-bold"
          >
            {resource.name}
          </h1>

          <div className="flex flex-wrap gap-2 mt-2">
            {categoryLabel && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(168,85,247,0.15)", color: "var(--color-primary)" }}
              >
                {categoryLabel}
              </span>
            )}
            {resource.isEmergency && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "rgba(239,68,68,0.2)", color: "var(--color-danger)" }}
              >
                Emergency Resource
              </span>
            )}
            {resource.isVerified && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "var(--color-success)" }}
              >
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "var(--color-muted)", borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem" }}
        >
          {resource.description}
        </p>
      )}

      {/* Details grid */}
      <div
        className="rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        {locationLabel && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted)" }}>
              Location
            </p>
            <p className="text-sm" style={{ color: "var(--color-text)" }}>
              {locationLabel}
            </p>
          </div>
        )}

        {resource.hours && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted)" }}>
              Hours
            </p>
            <p className="text-sm" style={{ color: "var(--color-text)" }}>
              {resource.hours}
            </p>
          </div>
        )}

        {/* Contact */}
        {resource.contact && (
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
              Contact
            </p>
            <div className="flex flex-wrap gap-3">
              {resource.contact.website && (
                <ContactItem href={resource.contact.website} label="Website">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  Website
                </ContactItem>
              )}
              {resource.contact.phone && (
                <ContactItem href={`tel:${resource.contact.phone.replace(/\s/g, "")}`} label="Phone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  {resource.contact.phone}
                </ContactItem>
              )}
              {resource.contact.email && (
                <ContactItem href={`mailto:${resource.contact.email}`} label="Email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Email
                </ContactItem>
              )}
              {resource.contact.instagram && (
                <ContactItem
                  href={`https://instagram.com/${resource.contact.instagram}`}
                  label="Instagram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </ContactItem>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full content */}
      {(resource.content?.length ?? 0) > 0 && (
        <div
          className="pt-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <PortableText value={resource.content!} />
        </div>
      )}

      {/* Tags */}
      {(resource.tags?.length ?? 0) > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {resource.tags!.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--color-surface)", color: "var(--color-muted)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
