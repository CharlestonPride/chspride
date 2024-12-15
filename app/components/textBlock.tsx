import { TextBlock as TextBlockProps } from "@/sanity/lib/sanity.types";
import { PortableText } from "next-sanity";
import { Col, Row } from "react-bootstrap";

export default function TextBlock(props: TextBlockProps) {
  return (
    <Row>
      <Col lg="10" className="mx-auto">
        {props.content?.map((text, index) => {
          return <PortableText key={index} value={text}></PortableText>;
        })}
      </Col>
    </Row>
  );
}
