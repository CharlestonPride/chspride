import { client } from "@/sanity/lib/client";
import { HomeQueryResult, TwoColumnCard as TwoColumnCardProps } from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import Header from "../components/header";
import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import TwoColumnCard from "../components/card/twoColumnCard";
import SocialCard from "../components/card/socialCard";

export default async function Home() {
  const props = (await client.fetch(homeQuery) as HomeQueryResult)[0];
  let sectionCount = 0;
  return (
    <main >
      <Header {...props?.header as unknown as HeaderProps} />
      <h1>{props?.title}</h1>
      <code>
        {JSON.stringify(props)}
      </code>
      {props.content?.map(c => {
        if (c._type == 'twoColumnCard') {
          return <TwoColumnCard {...c as any as TwoColumnCardProps} orientation={sectionCount++ % 2 ? 'left' : 'right'}></TwoColumnCard>
        }
        if (c._type == 'socialsCard') {
          return <SocialCard></SocialCard>
        }
        return <></>
      })}
    </main>
  );
}