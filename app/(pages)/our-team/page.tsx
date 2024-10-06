"use client";
import { client } from "@/sanity/lib/client";
import {
  OurTeamQueryResult,
  Header as HeaderProps,
  Person,
} from "@/sanity/lib/sanity.types";
import { ourTeamQuery } from "@/sanity/queries";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import Header from "@/app/components/header";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SanityImage from "@/app/components/sanityImage";

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
      <Card.Body className="z-index-2 py-8">
        <h2>
          {getInitials(props)}
          <p>Coming Soon</p>
        </h2>
      </Card.Body>
    </Card>
  );
};

const getInitials = (props: Person) => {
  let name = props.email!.split("@")[0].split(".");
  return name[0][0].toUpperCase() + name[1][0].toUpperCase();
};

const BoardMember = (props: Person) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Col lg="6" className="my-5">
        <Card className="card-profile card-plain">
          <Row>
            <Col xs={{ span: 6, offset: 3 }} sm={{ span: 5, offset: 0 }}>
              <Headshot {...props} />
            </Col>
            <Col xs="12" sm="7">
              <Card.Body className="h-100 pt-lg-5 pb-0">
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
                      <Button variant="outline-info" onClick={handleShow}>
                        Bio
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
                    <Button variant="outline-info" onClick={handleShow}>
                      Bio
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{"About " + props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.bio?.split(/\r?\n/).map((b) => <p key={b}>{b}</p>)}
          {!props.bio?.length && <p>Bio coming soon.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default async function OurTeam() {
  const props = ((await client.fetch(ourTeamQuery)) as OurTeamQueryResult)[0];
  return (
    <main>
      <Header {...(props?.header as unknown as HeaderProps)} />
      <Container className="mt-5">
        <Row>
          <Col>
            <p className="lead">{props.description}</p>
          </Col>
        </Row>
        <Row>
          <Col className="mx-auto text-center mb-5">
            <h2 className="text-gradient text-info">The Executive Committee</h2>
          </Col>
        </Row>
        <Row>
          {props.executiveCommittee?.map((teamMember, index) => {
            return <BoardMember {...teamMember} key={index} />;
          })}
        </Row>
        <Row>
          <Col className="mx-auto text-center mb-5">
            <h2 className="text-gradient text-info">The Board Members</h2>
          </Col>
        </Row>
        <Row>
          {props.boardMembers?.map((teamMember, index) => {
            return <BoardMember {...teamMember} key={index} />;
          })}
        </Row>
      </Container>
    </main>
  );
}
