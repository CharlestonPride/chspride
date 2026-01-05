import { TextBlock as TextBlockProps } from "@/sanity/lib/sanity.types";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { Col, Row } from "react-bootstrap";
import LinkMark from "./portableText/link";

export default function TextBlock(props: TextBlockProps) {
  const components: Partial<PortableTextReactComponents> = {
    marks: {
      link: LinkMark,
    },
  };
  return (
    <Row className="py-5">
      <Col lg="8" className="mx-auto">
        <div>{JSON.stringify(props.content)}</div>
        {props.content?.map((text, index) => {
          return (
            <div className="lead" key={index}>
              <PortableText value={text} components={components}></PortableText>
            </div>
          );
        })}
      </Col>
    </Row>
  );
}
