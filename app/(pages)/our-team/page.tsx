"use client";
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
import { client } from "@/sanity/lib/client";
import { use, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

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

const BoardMember = ({
  person,
  setFocusedPerson,
}: {
  person: Person;
  setFocusedPerson: (person: Person) => void;
}) => {
  return (
    <>
      <Col lg="6" className="my-5">
        <Card className="card-profile card-plain">
          <Row>
            <Col xs={{ span: 6, offset: 3 }} sm={{ span: 5, offset: 0 }}>
              <Headshot {...person} />
            </Col>
            <Col xs="12" sm="7">
              <div className="h-100 pt-lg-5 pb-0">
                <div className="d-flex flex-column align-items-start h-100">
                  <div className="mb-auto">
                    <h5 className="font-weight-bolder mb-0">{person.name}</h5>

                    <p className="text-uppercase font-weight-bold mb-0">
                      {person.title}
                    </p>
                    <p>
                      <em>{person.pronouns}</em>
                    </p>
                    <div className="d-md-none">
                      <Button
                        variant="info"
                        className="me-2"
                        href={"mailto:" + person.email}
                      >
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                      </Button>
                      <Button
                        variant="outline-info"
                        onClick={() => setFocusedPerson(person)}
                      >
                        Bio
                      </Button>
                    </div>
                  </div>
                  <div className="d-none d-md-block">
                    <Button
                      variant="info"
                      className="me-2"
                      href={"mailto:" + person.email}
                    >
                      <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => setFocusedPerson(person)}
                    >
                      Bio
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

const BoardMemberList = ({
  ourTeam,
  setFocusedPerson,
}: {
  ourTeam: OurTeamQueryResult;
  setFocusedPerson: (person: Person) => void;
}) => {
  if (!ourTeam) return <></>;
  return (
    <Container>
      <Row>
        <Col className="mx-auto text-center my-5">
          {ourTeam.description && <p className="lead">{ourTeam.description}</p>}
        </Col>
      </Row>
      <Row>
        <h2 className={"text-center text-" + ourTeam.theme}>Board Members</h2>
        {ourTeam.members?.map((teamMember, index) => {
          return (
            <BoardMember
              person={teamMember}
              setFocusedPerson={setFocusedPerson}
              key={"board_" + index}
            />
          );
        })}
      </Row>
      {ourTeam.volunteers && (
        <Row>
          <h2 className={"text-center text-" + ourTeam.theme}>
            Distinguished Volunteers
          </h2>
          {ourTeam.volunteers.map((volunteer, index) => {
            return (
              <BoardMember
                person={volunteer}
                setFocusedPerson={setFocusedPerson}
                key={"volunteer_" + index}
              />
            );
          })}
        </Row>
      )}
      {ourTeam.team && (
        <Row>
          <Col lg="8" className="mx-auto my-5">
            <SanityImage
              {...ourTeam.team}
              _key="team"
              imgClass="w-100 rounded-3 shadow-lg"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default function OurTeam() {
  const [team, setTeam] = useState<OurTeamQueryResult | null>(null);
  const [focusedPerson, setFocusedPerson] = useState<Person | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await client.fetch(ourTeamQuery);
      setTeam(result);
    }
    fetchData();
  }, []);

  if (!team) return <></>;
  const content = [
    <BoardMemberList
      key="boardlist"
      ourTeam={team}
      setFocusedPerson={setFocusedPerson}
    ></BoardMemberList>,
  ];
  const headerProps = { header: team.header, content, id: "our-team" };

  return (
    <main>
      <HeaderBuilder {...headerProps}></HeaderBuilder>
      {focusedPerson && (
        <Modal show={true} onHide={() => setFocusedPerson(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{"About " + focusedPerson.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {focusedPerson?.bio?.split(/\r?\n/).map((b) => <p key={b}>{b}</p>)}
            {!focusedPerson?.bio?.length && <p>Bio coming soon.</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={() => setFocusedPerson(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </main>
  );
}
