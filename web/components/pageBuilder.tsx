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
import Alert from "./alert";

export default function PageBuilder(props: Page) {
  let sectionCount = 0;

  const renderSection = (section: NonNullable<Page["content"]>[number]) => {
    const key = section?._key ?? `${section?._type}-${sectionCount}`;

    switch (section?._type) {
      case "twoColumnCard":
        return (
          <TwoColumnCard
            {...section}
            orientation={sectionCount++ % 2 ? "left" : "right"}
            key={key}
          />
        );
      case "socialsCard":
        return <SocialCard {...section} key={key} />;
      case "imageGalleryCard":
        return <GalleryCard {...section} key={key} />;
      case "twoColumnGalleryCard":
        return (
          <TwoColumnGalleryCard
            {...section}
            orientation={sectionCount++ % 2 ? "left" : "right"}
            key={key}
          />
        );
      case "embeddedForm":
        if (props.header?.style === "wave") {
          return <ExternalCard {...section} key={key} />;
        }
        return (
          <Row key={key}>
            <Col lg="10" className="mx-auto">
              <ExternalCard {...section} />
            </Col>
          </Row>
        );
      case "textBlock":
        return <TextBlock {...section} key={key} />;
      case "sponsorsCard":
        return <SponsorCard {...section} key={key} />;
      default:
        return null;
    }
  };

  const content = props.content?.map(renderSection);
  const headerProps = {
    header: props.header,
    content: content,
    id: props.slug?.current ?? "page",
  };
  return (
    <>
      {props.alert && <Alert {...props.alert} />}
      <HeaderBuilder {...headerProps} />
    </>
  );
}
