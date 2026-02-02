import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Col, Container, Row } from "react-bootstrap";
import { fbUrl, instagramUrl, twitterUrl } from "@/lib/socialMedia";
import { SocialsCard } from "@sanity/lib/sanity.types";

const Facebook = () => {
  return (
    <a
      href={fbUrl}
      className="btn btn-facebook me-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faFacebook} width="25px" className="me-2" />
      Facebook
    </a>
  );
};

const Instagram = () => {
  return (
    <a
      href={instagramUrl}
      className="btn btn-instagram me-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faInstagram} width="25px" className="me-2" />
      Instagram
    </a>
  );
};

const Twitter = () => {
  return (
    <a
      href={twitterUrl}
      className="btn btn-twitter me-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faTwitter} width="25px" className="me-2" />
      Twitter
    </a>
  );
};

const SocialCard = (props: SocialsCard) => {
  return (
    <Container className="my-5">
      <Row className="mx-auto">
        <Col md="6">
          <h4 className="mb-1">Thank you for your support!</h4>
          <p className="lead">
            Stay tuned to our socials for the latest updates.
          </p>
        </Col>
        <Col
          md="6"
          className="d-flex align-items-center justify-content-around"
        >
          <Facebook />
          {/* <Twitter /> */}
          <Instagram />
        </Col>
      </Row>
    </Container>
  );
};

export default SocialCard;
