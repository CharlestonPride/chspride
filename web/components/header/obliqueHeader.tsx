import { Container, Row, Col } from "react-bootstrap";
import { LinkButton } from "../button";
import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import { getStyle } from "./headerUtil";

export default function ObliqueHeader(props: HeaderProps) {
  return (
    <header>
      <div className="page-header section-height-75">
        <div className="oblique position-absolute top-0 h-100 d-md-block d-none">
          <div
            className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
            style={getStyle(props)}
          ></div>
        </div>
        <Container>
          <Row>
            <Col
              md="7"
              lg="5"
              className="d-flex justify-content-center flex-column"
            >
              <h1 className={`text-${props.theme}`}>{props.title}</h1>
              {props.subtitle && <h2>{props.subtitle}</h2>}
              {props.buttons?.map((button) => {
                return (
                  <LinkButton
                    reference={button.reference}
                    label={button.label!}
                    url={button.url}
                    theme={props.theme!}
                    style="gradient"
                    key={button.label}
                  ></LinkButton>
                );
              })}
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}
