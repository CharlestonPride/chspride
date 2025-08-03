import PageBuilder from "@/components/pageBuilder";
import { client } from "@/sanity/lib/client";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const props = await client.fetch<PageProps>(pageBySlugQuery, await params);
  if (!props) {
    return notFound();
  }

  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}

export async function generateStaticParams() {
  const results = (await client.fetch(slugsQuery)) as [{ slug: string }];

  return results.map((r) => ({
    slug: r.slug,
  }));
}
