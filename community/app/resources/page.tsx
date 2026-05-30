import type { Metadata } from "next";
import Link from "next/link";
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
        <p className="mt-2 text-base" style={{ color: "var(--color-muted)" }}>
          LGBTQIA+ resources across healthcare, mental health, legal services, and more.
        </p>
        <Link
          href="/resources/submit"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          + Submit a Resource
        </Link>
      </div>

      <ResourceFilters resources={resources} />
    </div>
  );
}
