import PageBuilder from "@/components/pageBuilder";
import { client } from "@/sanity/lib/client";
import { previewClient } from "@/sanity/lib/previewClient";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import SlugPreview from "@/components/preview/SlugPreview";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <SlugPreview slug={slug} />;
  }

  const props = await client.fetch<PageProps>(pageBySlugQuery, { slug });
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
  const fetchClient =
    process.env.NEXT_PUBLIC_PREVIEW_MODE === "true" ? previewClient : client;
  const results = (await fetchClient.fetch(slugsQuery)) as [{ slug: string }];

  return results.map((r) => ({
    slug: r.slug,
  }));
}
