import PageBuilder from "@/components/pageBuilder";
import { client } from "@/sanity/lib/client";
import { HomeQueryResult, Page as PageProps } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/lib/queries";
import HomePreview from "@/components/preview/HomePreview";

export default async function Home() {
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <HomePreview />;
  }

  const data = await client.fetch(homeQuery);
  const props = (data as HomeQueryResult)[0] as unknown as PageProps;
  return (
    <main>
      <PageBuilder {...props} />
    </main>
  );
}
