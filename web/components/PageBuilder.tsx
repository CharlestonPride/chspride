import GalleryCard from "./card/GalleryCard";
import SocialCard from "./card/SocialCard";
import TwoColumnCard from "./card/TwoColumnCard";
import TwoColumnGalleryCard from "./card/TwoColumnGalleryCard";
import EventCard from "./card/EventCard";
import { Page } from "@/sanity/lib/sanity.types";
import { Row, Col } from "react-bootstrap";
import ExternalCard from "./card/ExternalCard";
import TextBlock from "./TextBlock";
import HeaderBuilder from "./header/HeaderBuilder";
import SponsorCard from "./card/SponsorCard";
import UpcomingEventsCard from "./card/UpcomingEventsCard";
import Alert from "./Alert";

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
    if (c._type == "eventCard") {
      const ec = c as any;
      if (!ec.event) return <></>;
      return (
        <EventCard
          event={ec.event}
          orientation={sectionCount++ % 2 ? "left" : "right"}
          key={index}
        />
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
    if (c._type == "upcomingEventsCard") {
      const uc = c as any;
      return (
        <UpcomingEventsCard
          key={index}
          title={uc.title}
          maxNonFeatured={uc.maxNonFeatured}
          theme={uc.theme}
        />
      );
    }
    return <></>;
  });
  const headerProps = {
    header: props.header,
    content: content,
    id: props.slug?.current ?? "page",
  };
  return (
    <>
      {props.alert && <Alert {...props.alert} />}
      <HeaderBuilder {...headerProps} key={headerProps.id}></HeaderBuilder>
    </>
  );
}
