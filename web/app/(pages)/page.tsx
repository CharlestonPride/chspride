import PageBuilder from "@/components/pageBuilder";
import { client } from "@/sanity/lib/client";
import { HomeQueryResult, Page as PageProps } from "@sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const data = await client.fetch(homeQuery);
  const props = (data as HomeQueryResult)[0] as unknown as PageProps;
  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}
