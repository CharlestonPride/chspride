import Header from "@/app/components/header";
import { client } from "@/sanity/lib/client";
import {
  PageBySlugQueryResult,
  Header as HeaderProps,
} from "@/sanity/lib/sanity.types";
import { pageBySlugQuery, slugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const props = (await client.fetch(
    pageBySlugQuery,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  )) as PageBySlugQueryResult;

  if (!props) {
    return notFound();
  }

  return (
    <main>
      <Header {...(props?.header as unknown as HeaderProps)} />
      <div>{JSON.stringify(props)}</div>
    </main>
  );
}

export async function generateStaticParams() {
  const results = (await client.fetch(slugsQuery)) as [{ slug: string }];

  return results.map((r) => ({
    slug: r.slug,
  }));
}
