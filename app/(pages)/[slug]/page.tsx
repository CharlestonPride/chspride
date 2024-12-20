import { client } from "@/sanity/lib/client";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";
import PageBuilder from "@/app/components/pageBuilder";
import { FilteredResponseQueryOptions } from "next-sanity";
import { draftMode } from "next/headers";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
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
    { slug: params.slug },
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

export async function generateStaticParams() {
  const results = (await client.fetch(slugsQuery)) as [{ slug: string }];

  return results.map((r) => ({
    slug: r.slug,
  }));
}
