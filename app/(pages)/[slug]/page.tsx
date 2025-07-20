import PageBuilder from "@/components/pageBuilder";
import { client } from "@/sanity/lib/client";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await client.fetch(pageBySlugQuery, params);
  const props = data as PageProps;
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
