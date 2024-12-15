import { client } from "@/sanity/lib/client";
import { HomeQueryResult } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import { Page as PageProps } from "@/sanity/lib/sanity.types";
import PageBuilder from "../components/pageBuilder";

export default async function Home() {
  const props = (
    (await client.fetch(homeQuery)) as HomeQueryResult
  )[0] as unknown as PageProps;
  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}
