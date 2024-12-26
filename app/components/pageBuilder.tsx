import GalleryCard from "./card/galleryCard";
import SocialCard from "./card/socialCard";
import TwoColumnCard from "./card/twoColumnCard";
import TwoColumnGalleryCard from "./card/twoColumnGalleryCard";
import { Page } from "@/sanity/lib/sanity.types";
import ExternalCard from "./card/externalCard";
import TextBlock from "./textBlock";
import HeaderBuilder from "./header/headerBuilder";
import SponsorCard from "./card/sponsorCard";

export default function PageBuilder(props: Page) {
  let sectionCount = 0;

  let content = props.content?.map((c) => {
    if (c._type == "twoColumnCard") {
      return (
        <TwoColumnCard
          {...c}
          orientation={sectionCount++ % 2 ? "left" : "right"}
        ></TwoColumnCard>
      );
    }
    if (c._type == "socialsCard") {
      return <SocialCard {...c}></SocialCard>;
    }
    if (c._type == "imageGalleryCard") {
      return <GalleryCard {...c}></GalleryCard>;
    }
    if (c._type == "twoColumnGalleryCard") {
      return (
        <TwoColumnGalleryCard
          {...c}
          orientation={sectionCount++ % 2 ? "left" : "right"}
        ></TwoColumnGalleryCard>
      );
    }
    if (c._type == "embeddedForm") {
      return <ExternalCard {...c}></ExternalCard>;
    }
    if (c._type == "textBlock") {
      return <TextBlock {...c}></TextBlock>;
    }
    if (c._type == "sponsorsCard") {
      return <SponsorCard {...c}></SponsorCard>;
    }
    return <></>;
  });
  const headerProps = { header: props.header, content: content };
  return <HeaderBuilder {...headerProps}></HeaderBuilder>;
}
