import { HomeQueryResult } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import PageBuilder from "@/components/pageBuilder";
import { draftMode } from "next/headers";
import { FilteredResponseQueryOptions } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

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
  const { data } = await sanityFetch({ query: homeQuery });
  const props = (data as HomeQueryResult)[0] as unknown as PageProps;
  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}
