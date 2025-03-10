import GalleryCard from "./card/galleryCard";
import SocialCard from "./card/socialCard";
import TwoColumnCard from "./card/twoColumnCard";
import TwoColumnGalleryCard from "./card/twoColumnGalleryCard";
import { Page } from "@/sanity/lib/sanity.types";
import { Row, Col } from "react-bootstrap";
import ExternalCard from "./card/externalCard";
import TextBlock from "./textBlock";
import HeaderBuilder from "./header/headerBuilder";
import SponsorCard from "./card/sponsorCard";

export default function PageBuilder(props: Page) {
  let sectionCount = 0;

  let content = props.content?.map((c, index) => {
    if (c._type == "twoColumnCard") {
      return (
        <TwoColumnCard
          {...c}
          orientation={sectionCount++ % 2 ? "left" : "right"}
          key={index}
        ></TwoColumnCard>
      );
    }
    if (c._type == "socialsCard") {
      return <SocialCard {...c} key={index}></SocialCard>;
    }
    if (c._type == "imageGalleryCard") {
      return <GalleryCard {...c} key={index}></GalleryCard>;
    }
    if (c._type == "twoColumnGalleryCard") {
      return (
        <TwoColumnGalleryCard
          {...c}
          orientation={sectionCount++ % 2 ? "left" : "right"}
          key={index}
        ></TwoColumnGalleryCard>
      );
    }
    if (c._type == "embeddedForm") {
      if (props.header && props.header?.style === "wave") {
        return <ExternalCard {...c} key={index}></ExternalCard>;
      } else {
        return (
          <Row key={index}>
            <Col lg="10" className="mx-auto">
              <ExternalCard {...c}></ExternalCard>
            </Col>
          </Row>
        );
      }
    }
    if (c._type == "textBlock") {
      return <TextBlock {...c} key={index}></TextBlock>;
    }
    if (c._type == "sponsorsCard") {
      return <SponsorCard {...c} key={index}></SponsorCard>;
    }
    return <></>;
  });
  const headerProps = {
    header: props.header,
    content: content,
    id: props.slug?.current ?? "page",
  };
  return <HeaderBuilder {...headerProps} key={headerProps.id}></HeaderBuilder>;
}
