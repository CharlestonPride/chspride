import GalleryCard from "./card/galleryCard";
import SocialCard from "./card/socialCard";
import TwoColumnCard from "./card/twoColumnCard";
import TwoColumnGalleryCard from "./card/twoColumnGalleryCard";
import { Page } from "@/sanity/lib/sanity.types";
import BlockHeader from "./header/blockHeader";
import ObliqueHeader from "./header/obliqueHeader";
import WaveHeader from "./header/waveHeader";
import ExternalCard from "./card/externalCard";
import TextBlock from "./textBlock";

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
    return <></>;
  });
  return (
    <>
      {props.header?.style == "block" && (
        <BlockHeader {...props.header}></BlockHeader>
      )}
      {props.header?.style == "oblique" && (
        <ObliqueHeader {...props.header}></ObliqueHeader>
      )}
      {props.header?.style == "wave" ? (
        <WaveHeader header={props.header} children={content}></WaveHeader>
      ) : (
        content
      )}
    </>
  );
}
