import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { uipResourcesQuery } from "@/sanity/lib/queries";
import type { ResourceCardData } from "@/components/ResourceCard";
import ResourceFilters from "@/components/ResourceFilters";

export const metadata: Metadata = {
  title: "Resources",
  description: "LGBTQIA+ community resources in Charleston and the Lowcountry — healthcare, support, legal services, and more.",
};

export default async function ResourcesPage() {
  const resources = await client.fetch<ResourceCardData[]>(
    uipResourcesQuery,
    {},
    { next: { revalidate: 3600 } }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          Community Resources
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          LGBTQIA+ resources across healthcare, mental health, legal services, and more.
        </p>
      </div>

      <ResourceFilters resources={resources} />
    </div>
  );
}
