import { TextBlock as TextBlockProps } from "@/sanity/lib/sanity.types";
import { PortableText } from "@portabletext/react";
import { Col, Row } from "react-bootstrap";
import { portableTextComponents } from "./portableText/components";

export default function TextBlock(props: TextBlockProps) {
  return (
    <Row className="py-5">
      <Col lg="8" className="mx-auto">
        {props.content?.map((text, index) => {
          return (
            <div className="lead" key={index}>
              <PortableText
                value={text}
                components={portableTextComponents}
              ></PortableText>
            </div>
          );
        })}
      </Col>
    </Row>
  );
}
