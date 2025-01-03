import { client } from "@/sanity/lib/client";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";
import PageBuilder from "@/components/pageBuilder";
import { FilteredResponseQueryOptions } from "next-sanity";
import { draftMode } from "next/headers";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const options: FilteredResponseQueryOptions | undefined = isEnabled
    ? {
        perspective: "previewDrafts",
        useCdn: false,
        stega: true,
      }
    : { next: { revalidate: 0 } };

  const props = (await client.fetch(
    pageBySlugQuery,
    { slug },
    options
  )) as PageProps;

  if (!props) {
    return notFound();
  }

  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}

// Next.js will invalidate the cache when a
// request comes in, at most once every hour.
export const revalidate = 3600;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const results = (await client.fetch(slugsQuery)) as [{ slug: string }];

  return results.map((r) => ({
    slug: r.slug,
  }));
}
