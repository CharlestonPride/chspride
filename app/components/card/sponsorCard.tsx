import { Container, Row, Col } from "react-bootstrap";

export default function SponsorsCard(props: any) {
  return (
    <Container className="my-5">
      <Row className="mx-auto">
        <Col md="6">
          <h4 className="mb-1">Thank You to Our Sponsors</h4>
        </Col>
        <Col
          md="6"
          className="d-flex align-items-center justify-content-around"
        ></Col>
      </Row>
    </Container>
  );
}
