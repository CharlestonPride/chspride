import { client } from "@/sanity/lib/client";
import {
  HomeQueryResult,
  ImageGalleryCard as ImageGalleryCardProps,
  TwoColumnCard as TwoColumnCardProps,
  TwoColumnGalleryCard as TwoColumnGalleryCardProps,
} from "@/sanity/lib/sanity.types";
import { homeQuery } from "@/sanity/queries";
import Header from "../components/header";
import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import TwoColumnCard from "../components/card/twoColumnCard";
import SocialCard from "../components/card/socialCard";
import GalleryCard from "../components/card/galleryCard";
import TwoColumnGalleryCard from "../components/card/twoColumnGalleryCard";

export default async function Home() {
  const props = ((await client.fetch(homeQuery)) as HomeQueryResult)[0];
  let sectionCount = 0;
  return (
    <main>
      <Header {...(props?.header as unknown as HeaderProps)} />
      {props.content?.map((c) => {
        if (c._type == "twoColumnCard") {
          return (
            <TwoColumnCard
              {...(c as unknown as TwoColumnCardProps)}
              orientation={sectionCount++ % 2 ? "left" : "right"}
            ></TwoColumnCard>
          );
        }
        if (c._type == "socialsCard") {
          return <SocialCard></SocialCard>;
        }
        if (c._type == "imageGalleryCard") {
          return <GalleryCard {...(c as ImageGalleryCardProps)}></GalleryCard>;
        }
        if (c._type == "twoColumnGalleryCard") {
          return (
            <TwoColumnGalleryCard
              {...(c as unknown as TwoColumnGalleryCardProps)}
              orientation={sectionCount++ % 2 ? "left" : "right"}
            ></TwoColumnGalleryCard>
          );
        }
        return <></>;
      })}
    </main>
  );
}
