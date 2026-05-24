import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export interface ResourceCardData {
  _id: string;
  name: string;
  slug: string;
  logo?: { asset?: { _ref?: string } };
  category?: string;
  description?: string;
  contact?: { phone?: string; website?: string };
  location?: { city?: string; state?: string; isVirtual?: boolean; serviceArea?: string };
  hours?: string;
  isEmergency?: boolean;
  isFeatured?: boolean;
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

export default function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const logoRef = resource.logo?.asset?._ref;
  const logoUrl = logoRef ? urlFor(resource.logo!).width(256).height(256).fit("crop").url() : null;
  const categoryLabel = resource.category ? (CATEGORY_LABELS[resource.category] ?? resource.category) : null;
  const locationLabel = resource.location?.isVirtual
    ? (resource.location.serviceArea ?? "Online")
    : resource.location?.city
    ? `${resource.location.city}, ${resource.location.state ?? "SC"}`
    : null;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex gap-4 rounded-xl p-4 transition-colors hover:border-purple-500"
      style={{
        backgroundColor: "var(--color-card)",
        border: `1px solid ${resource.isEmergency ? "var(--color-danger)" : "var(--color-border)"}`,
        textDecoration: "none",
      }}
    >
      {/* Logo */}
      <div
        className="shrink-0 w-32 h-32 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={resource.name} className="w-full h-full object-contain" />
        ) : (
          <div
            className="w-full h-full rounded-lg"
            style={{ background: "var(--gradient-rainbow)", opacity: 0.4 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
            className="font-semibold text-sm leading-snug group-hover:text-purple-300 transition-colors"
          >
            {resource.name}
          </h3>

          {resource.isEmergency && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
              style={{ backgroundColor: "rgba(239,68,68,0.2)", color: "var(--color-danger)" }}
            >
              Emergency
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryLabel && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(168,85,247,0.15)", color: "var(--color-primary)" }}
            >
              {categoryLabel}
            </span>
          )}
          {locationLabel && (
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              {locationLabel}
            </span>
          )}
        </div>

        {resource.description && (
          <p
            style={{ color: "var(--color-muted)" }}
            className="text-xs line-clamp-2 mt-0.5"
          >
            {resource.description}
          </p>
        )}
      </div>
    </Link>
  );
}
