import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { uipOrganizationsQuery } from "@/sanity/lib/queries";
import OrganizationCard, { type OrganizationData } from "@/components/OrganizationCard";
import { CHARLESTON_PRIDE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Organizations",
  description: "LGBTQIA+ organizations serving Charleston and the Lowcountry.",
};

export default async function OrganizationsPage() {
  const orgs = await client.fetch<OrganizationData[]>(
    uipOrganizationsQuery,
    {},
    { next: { revalidate: 3600 } }
  );

  const organizations: OrganizationData[] = [CHARLESTON_PRIDE, ...orgs];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          LGBTQIA+ Organizations
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Organizations serving Charleston and the Lowcountry&apos;s LGBTQIA+ community.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {organizations.map((org) => (
          <OrganizationCard key={org._id} org={org} />
        ))}
      </div>
    </div>
  );
}
