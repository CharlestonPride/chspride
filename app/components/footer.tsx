import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMap } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col } from "react-bootstrap";
import { fbUrl, twitterUrl, instagramUrl } from "../lib/socialMedia";

type SocialProps = {
  url: string;
  icon: IconDefinition;
};

const SocialLink = ({ url, icon }: SocialProps) => {
  return (
    <a
      href={url}
      className="text-secondary me-3"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={icon} size="2x" />
    </a>
  );
};

const Address = () => {
  return (
    <li>
      <FontAwesomeIcon icon={faMap} listItem />
      Charleston Pride Festival, Inc
      <br /> PO Box #71084 <br />
      North Charleston, SC 29415
    </li>
  );
};

const Email = () => {
  return (
    <li>
      <FontAwesomeIcon icon={faEnvelope} listItem />
      <a href="mailto:info@charlestonpride.org">info@charlestonpride.org</a>
    </li>
  );
};

const Footer = ({}) => {
  const year = new Date().getFullYear();
  return (
    <>
      <hr className="horizontal dark"></hr>
      <footer className="footer py-2">
        <Container>
          <Row>
            <Col lg="4" className="my-2">
              <address>
                <ul className="fa-ul">
                  <Address />
                  <Email />
                </ul>
              </address>
            </Col>
            <Col lg="4" className="my-2 text-center">
              <p className="text-secondary">
                Copyright © {year} Charleston Pride Festival, Inc. <br /> All
                Rights Reserved.
              </p>
            </Col>
            <Col lg="4" className="mx-auto text-center">
              <SocialLink url={fbUrl} icon={faFacebook} />
              <SocialLink url={twitterUrl} icon={faTwitter} />
              <SocialLink url={instagramUrl} icon={faInstagram} />
            </Col>
          </Row>
          <Row>
            <Col xs="8" className="mx-auto text-center mt-1">
              <p className="mb-0 text-secondary">
                Charleston Pride Festival, Inc. is a 501(c)(3) public charity
                under the Internal Revenue Service Code of 1986 and the State of
                South Carolina.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
export default Footer;
