import { OurTeamQueryResult, Person } from "@/sanity/lib/sanity.types";
import { ourTeamQuery } from "@/sanity/queries";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderBuilder from "@/components/header/headerBuilder";
import SanityImage from "@/components/sanityImage";
import { sanityFetch } from "@/sanity/lib/live";

const Headshot = (props: Person) => {
  if (props.image) {
    return (
      <div className="position-relative">
        <div className="blur-shadow-image">
          <SanityImage
            _key={props.name!}
            {...props.image}
            imgClass="w-100 rounded-3 shadow-lg"
          />
        </div>
      </div>
    );
  }
  return (
    <Card className="bg-cover text-center">
      <div className="z-index-2 py-8">
        <h2>
          {getInitials(props)}
          <p>Coming Soon</p>
        </h2>
      </div>
    </Card>
  );
};

const getInitials = (props: Person) => {
  let name = props.email!.split("@")[0].split(".");
  return name[0][0].toUpperCase() + name[1][0].toUpperCase();
};

const BoardMember = (props: Person) => {
  return (
    <>
      <Col lg="6" className="my-5">
        <Card className="card-profile card-plain">
          <Row>
            <Col xs={{ span: 6, offset: 3 }} sm={{ span: 5, offset: 0 }}>
              <Headshot {...props} />
            </Col>
            <Col xs="12" sm="7">
              <div className="h-100 pt-lg-5 pb-0">
                <div className="d-flex flex-column align-items-start h-100">
                  <div className="mb-auto">
                    <h5 className="font-weight-bolder mb-0">{props.name}</h5>

                    <p className="text-uppercase font-weight-bold mb-0">
                      {props.title}
                    </p>
                    <p>
                      <em>{props.pronouns}</em>
                    </p>
                    <div className="d-md-none">
                      <Button
                        variant="info"
                        className="me-2"
                        href={"mailto:" + props.email}
                      >
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                      </Button>
                    </div>
                  </div>
                  <div className="d-none d-md-block">
                    <Button
                      variant="info"
                      className="me-2"
                      href={"mailto:" + props.email}
                    >
                      <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

const BoardMemberList = (props: OurTeamQueryResult) => {
  if (!props) return <></>;
  return (
    <Container>
      <Row>
        <Col className="mx-auto text-center my-5">
          {props.description && <p className="lead">{props.description}</p>}
        </Col>
      </Row>
      <Row>
        {props.members?.map((teamMember, index) => {
          return <BoardMember {...teamMember} key={index} />;
        })}
      </Row>
      {props.team && (
        <Row>
          <Col lg="8" className="mx-auto my-5">
            <SanityImage
              {...props.team}
              _key="team"
              imgClass="w-100 rounded-3 shadow-lg"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

//export const revalidate = 3600;

export default async function OurTeam() {
  const { data } = await sanityFetch({ query: ourTeamQuery, tag: "our-team" });
  const props = data as OurTeamQueryResult;
  if (!props) return <></>;
  const content = [
    <BoardMemberList key="boardlist" {...props}></BoardMemberList>,
  ];
  const headerProps = { header: props.header, content };

  return (
    <main>
      <HeaderBuilder {...headerProps}></HeaderBuilder>
    </main>
  );
}
