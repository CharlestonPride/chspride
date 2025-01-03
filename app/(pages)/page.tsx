import { client } from "@/sanity/lib/client";
import { HomeQueryResult } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import PageBuilder from "@/components/pageBuilder";
import { draftMode } from "next/headers";
import { FilteredResponseQueryOptions } from "next-sanity";

export const revalidate = 3600;

export default async function Home() {
  const { isEnabled } = await draftMode();
  const options: FilteredResponseQueryOptions | undefined = isEnabled
    ? {
        perspective: "previewDrafts",
        useCdn: false,
        stega: true,
      }
    : undefined;
  const props = (
    (await client.fetch(homeQuery, {}, options)) as HomeQueryResult
  )[0] as unknown as PageProps;
  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}
