import { client } from "@/sanity/lib/client";
import { HomeQueryResult } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import Header from "../components/header";
import { Header as HeaderProps } from "@/sanity/lib/sanity.types";

export default async function Home() {
  const result = ((await client.fetch(homeQuery)) as HomeQueryResult)[0];
  return (
    <main >
      <Header {...result?.header as unknown as HeaderProps} />
      <h1>{result?.title}</h1>
      <code>
        {JSON.stringify(result)}
      </code>
    </main>
  );
}