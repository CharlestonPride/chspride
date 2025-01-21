import { sanityFetch } from "@/sanity/lib/live";
import {
  SponsorsCard as SponsorsCardProps,
  SponsorshipsQueryResult,
} from "@/sanity/lib/sanity.types";
import { sponsorshipsQuery } from "@/sanity/queries";
import { Container, Row, Col } from "react-bootstrap";

type Sponsorship = SponsorshipsQueryResult[number];

function getSponsorshipColor(sponsorship: Sponsorship) {
  switch (sponsorship.level) {
    case 6:
      return "red";
    case 5:
      return "orange";
    case 4:
      return "yellow";
    case 3:
      return "green";
    case 2:
      return "blue";
    default:
      return "purple";
  }
}

const Sponsor = (sponsorship: Sponsorship) => {
  return (
    <div
      key={sponsorship.sponsor!.name}
      className={
        "text-center mb-2 pb-2 sponsor-card sponsor-card-" +
        getSponsorshipColor(sponsorship)
      }
    >
      <a
        href={sponsorship.sponsor!.website!}
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        <img src={sponsorship.sponsor!.logo?.url!} className="img-fluid" />
      </a>
    </div>
  );
};

export default async function SponsorCard(props: SponsorsCardProps) {
  const { data } = await sanityFetch({
    query: sponsorshipsQuery,
    params: { year: props.year, event: [props.event] },
  });
  const sponsorships = data as SponsorshipsQueryResult;
  return (
    <Container className="my-5">
      <Row className="mx-auto">
        <h1 className="text-gradient text-primary text-center mb-3">
          {props.title}
        </h1>
      </Row>
      <Row className="align-items-end">
        {sponsorships
          .filter((sponsor) => sponsor?.featured)
          .map((sponsorship, index) => {
            return (
              <Col
                key={index}
                xs={{ span: 10, offset: 1 }}
                md={{ span: 6, offset: 2 }}
                lg={{ span: 4, offset: 1 }}
              >
                <Sponsor {...sponsorship} />
              </Col>
            );
          })}
      </Row>
      <Row className="align-items-end">
        {sponsorships
          .filter((sponsor) => !sponsor?.featured)
          .map((sponsorship, index) => {
            return (
              <Col
                key={index}
                xs={{ span: 6, offset: 0 }}
                md={{ span: 4, offset: 0 }}
                lg={{ span: 2, offset: 0 }}
              >
                <Sponsor {...sponsorship} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}
